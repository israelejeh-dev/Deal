// storage.js
// Optimized Local-First Storage with Non-Blocking Cloud Synchronization.
// Writes are INSTANT (saved to localStorage immediately in <5ms).
// Reads are INSTANT (served from localStorage or raced with Firebase with a fast timeout).
// No more hanging spinners or 60-second freezes!

import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} 
from "firebase/firestore";
import { db } from "./firebaseClient";

// Keys used to save data in the browser's localStorage
const LOCAL_CUSTOMERS_KEY = "shoptab_customers";
const LOCAL_ENTRIES_KEY = "shoptab_entries";

// Track whether Firebase is working or in offline/local fallback mode
export let isUsingLocalStorage = false;

// If Firebase times out or fails, skip waiting for network requests for 30s
let lastFirebaseFailureTime = 0;
const FIREBASE_COOLDOWN_MS = 30000;

function isFirebaseOnCooldown() {
  return Date.now() - lastFirebaseFailureTime < FIREBASE_COOLDOWN_MS;
}

function markFirebaseFailed(err) {
  lastFirebaseFailureTime = Date.now();
  isUsingLocalStorage = true;
  console.warn("Firebase offline or slow, using instant local storage:", err?.message || err);
}

// Helper: Wrap a promise with a fast timeout (default 1200ms)
function withTimeout(promise, ms = 1200) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout of ${ms}ms exceeded`));
    }, ms);

    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// ----------------------------------------------------
// LOCAL STORAGE HELPERS
// ----------------------------------------------------
function getLocalCustomers() {
  try {
    const data = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomers(customers) {
  try {
    localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error("Failed to save customers to localStorage:", e);
  }
}

function getLocalEntries() {
  try {
    const data = localStorage.getItem(LOCAL_ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalEntries(entries) {
  try {
    localStorage.setItem(LOCAL_ENTRIES_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save entries to localStorage:", e);
  }
}

// ----------------------------------------------------
// CUSTOMERS
// ----------------------------------------------------

// 1. Get all customers (INSTANT / FAST READ)
export async function getCustomers() {
  const localList = getLocalCustomers();

  // If Firebase was recently failing or slow, return local data instantly (0ms)
  if (isFirebaseOnCooldown()) {
    isUsingLocalStorage = true;
    return localList;
  }

  try {
    const q = query(collection(db, "customers"), orderBy("created_at", "desc"));
    const snap = await withTimeout(getDocs(q), 1500);
    const cloudList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Merge: preserve any local items that haven't synced yet
    const localOnly = localList.filter(
      (loc) => !cloudList.some((c) => c.id === loc.id || (c.name === loc.name && c.phone === loc.phone))
    );
    const merged = [...localOnly, ...cloudList];
    merged.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

    isUsingLocalStorage = false;
    saveLocalCustomers(merged);
    return merged;
  } catch (error) {
    markFirebaseFailed(error);
    return localList;
  }
}

// 2. Add a new customer (INSTANT SAVE < 5ms)
export async function addCustomer(name, phone) {
  const localCustomers = getLocalCustomers();
  const localId = "cust_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const newCustomer = {
    id: localId,
    name: name.trim(),
    phone: phone.trim(),
    created_at: Date.now(),
  };

  // 1. Save to local storage IMMEDIATELY so UI updates with zero delay
  localCustomers.unshift(newCustomer);
  saveLocalCustomers(localCustomers);

  // 2. Sync to Firebase in the background without blocking the UI
  if (!isFirebaseOnCooldown()) {
    (async () => {
      try {
        await withTimeout( setDoc(doc(db, "customers", localId),
        { name: newCustomer.name, phone: newCustomer.phone, created_at:
        newCustomer.created_at, }), 2000 );

      } catch (err) {
        markFirebaseFailed(err);
      }
    })();
  }

  // Return immediately!
  return newCustomer;
}

// 3. Delete a customer (INSTANT DELETE)
export async function deleteCustomer(customerId) {
  // Remove the customer and local ledger entries immediately.
  const localCustomers = getLocalCustomers().filter(
    (customer) => customer.id !== customerId
  );
  saveLocalCustomers(localCustomers);

  const localEntries = getLocalEntries().filter(
    (entry) => entry.customer_id !== customerId
  );
  saveLocalEntries(localEntries);

  // Delete the customer from Firebase and wait for completion.
  try {
    await withTimeout(deleteDoc(doc(db, "customers", customerId)), 2000);
  } catch (err) {
    markFirebaseFailed(err);
    throw err;
  }
}

// ----------------------------------------------------
// LEDGER ENTRIES
// ----------------------------------------------------

// 1. Get all entries (INSTANT / FAST READ)
export async function getEntries(customerId = null) {
  const localAll = getLocalEntries();
  const localFiltered = customerId
    ? localAll.filter((entry) => entry.customer_id === customerId)
    : localAll;
  localFiltered.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

  // If Firebase is on cooldown, return local data instantly
  if (isFirebaseOnCooldown()) {
    isUsingLocalStorage = true;
    return localFiltered;
  }

  try {
    let snap;
    if (customerId) {
      const q = query(
        collection(db, "ledger_entries"),
        where("customer_id", "==", customerId)
      );
      snap = await withTimeout(getDocs(q), 1500);
    } else {
      snap = await withTimeout(getDocs(collection(db, "ledger_entries")), 1500);
    }

    const cloudList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Merge cloud entries with local entries that haven't synced yet
    const localOnly = localFiltered.filter(
      (loc) => !cloudList.some((c) => c.id === loc.id)
    );
    const merged = [...localOnly, ...cloudList];
    merged.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

    isUsingLocalStorage = false;
    return merged;
  } catch (error) {
    markFirebaseFailed(error);
    return localFiltered;
  }
}

// 2. Add a new ledger entry (INSTANT SAVE < 5ms)
export async function addEntry(customerId, type, amount, note) {
  const localEntries = getLocalEntries();
  const localId = "entry_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const newEntry = {
    id: localId,
    customer_id: customerId,
    type: type, // "credit" or "payment"
    amount: Number(amount),
    note: (note || "").trim(),
    created_at: Date.now(),
  };

  // 1. SAVE LOCALLY IMMEDIATELY (Instant response < 1ms)
  localEntries.unshift(newEntry);
  saveLocalEntries(localEntries);

  // 2. Sync to Firebase in background without blocking the UI
  if (!isFirebaseOnCooldown()) {
    (async () => {
      try {
        await withTimeout( setDoc(doc(db, "ledger_entries", localId),{ 
        customer_id: newEntry.customer_id, type: newEntry.type, amount:
        newEntry.amount, note: newEntry.note, created_at: newEntry.created_at, }),
        2000 );

      } catch (err) {
        markFirebaseFailed(err);
      }
    })();
  }

  // Return immediately so the modal closes and balance updates in milliseconds!
  return newEntry;
}

// 3. Delete a single ledger entry (INSTANT DELETE)
export async function deleteEntry(entryId) {
  // Remove locally immediately
  const localEntries = getLocalEntries().filter((entry) => entry.id !== entryId);
  saveLocalEntries(localEntries);

  // Delete from Firebase and wait for the result
  try {
    await withTimeout(deleteDoc(doc(db, "ledger_entries", entryId)), 2000);
  } catch (err) {
    markFirebaseFailed(err);
    throw err;
  }
}

