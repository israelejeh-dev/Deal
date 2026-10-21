// storage.js
// This helper manages all data for ShopTab.
// It tries to use Firebase Firestore first.
// If Firebase is not configured or throws a permission error,
// it automatically falls back to browser localStorage so your app ALWAYS works!

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebaseClient";

// Keys used to save data in the browser's localStorage
const LOCAL_CUSTOMERS_KEY = "shoptab_customers";
const LOCAL_ENTRIES_KEY = "shoptab_entries";

// Track whether Firebase is working or in offline/local fallback mode
export let isUsingLocalStorage = false;

// Helper: Read customers from localStorage
function getLocalCustomers() {
  const data = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
  return data ? JSON.parse(data) : [];
}

// Helper: Save customers to localStorage
function saveLocalCustomers(customers) {
  localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(customers));
}

// Helper: Read ledger entries from localStorage
function getLocalEntries() {
  const data = localStorage.getItem(LOCAL_ENTRIES_KEY);
  return data ? JSON.parse(data) : [];
}

// Helper: Save ledger entries to localStorage
function saveLocalEntries(entries) {
  localStorage.setItem(LOCAL_ENTRIES_KEY, JSON.stringify(entries));
}

// ----------------------------------------------------
// CUSTOMERS
// ----------------------------------------------------

// 1. Get all customers
export async function getCustomers() {
  try {
    const q = query(collection(db, "customers"), orderBy("created_at", "desc"));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    isUsingLocalStorage = false;
    // Cache to localStorage for offline viewing
    saveLocalCustomers(list);
    return list;
  } catch (error) {
    console.warn("Firebase unavailable, using local storage:", error.message);
    isUsingLocalStorage = true;
    return getLocalCustomers();
  }
}

// 2. Add a new customer
export async function addCustomer(name, phone) {
  const newCustomer = {
    name: name.trim(),
    phone: phone.trim(),
    created_at: Date.now(),
  };

  try {
    const docRef = await addDoc(collection(db, "customers"), newCustomer);
    isUsingLocalStorage = false;
    return { id: docRef.id, ...newCustomer };
  } catch (error) {
    console.warn("Could not save to Firebase, saving locally:", error.message);
    isUsingLocalStorage = true;

    // Save to local storage with a generated id
    const localCustomers = getLocalCustomers();
    const localItem = {
      id: "local_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      ...newCustomer,
    };
    localCustomers.unshift(localItem);
    saveLocalCustomers(localCustomers);
    return localItem;
  }
}

// 3. Delete a customer
export async function deleteCustomer(customerId) {
  try {
    await deleteDoc(doc(db, "customers", customerId));
  } catch (error) {
    console.warn("Could not delete from Firebase, deleting locally:", error.message);
    isUsingLocalStorage = true;
  }

  // Also remove from local storage
  const localCustomers = getLocalCustomers().filter((c) => c.id !== customerId);
  saveLocalCustomers(localCustomers);

  // Also remove customer's ledger entries locally
  const localEntries = getLocalEntries().filter((e) => e.customer_id !== customerId);
  saveLocalEntries(localEntries);
}

// ----------------------------------------------------
// LEDGER ENTRIES
// ----------------------------------------------------

// 1. Get all entries (or for a specific customer)
export async function getEntries(customerId = null) {
  try {
    let snap;
    if (customerId) {
      const q = query(
        collection(db, "ledger_entries"),
        where("customer_id", "==", customerId)
      );
      snap = await getDocs(q);
    } else {
      snap = await getDocs(collection(db, "ledger_entries"));
    }

    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Sort newest first
    list.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
    isUsingLocalStorage = false;
    return list;
  } catch (error) {
    console.warn("Firebase entries unavailable, using local storage:", error.message);
    isUsingLocalStorage = true;
    const all = getLocalEntries();
    const filtered = customerId
      ? all.filter((entry) => entry.customer_id === customerId)
      : all;
    filtered.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
    return filtered;
  }
}

// 2. Add a new ledger entry (credit or payment)
export async function addEntry(customerId, type, amount, note) {
  const newEntry = {
    customer_id: customerId,
    type: type, // "credit" or "payment"
    amount: Number(amount),
    note: (note || "").trim(),
    created_at: Date.now(),
  };

  try {
    const docRef = await addDoc(collection(db, "ledger_entries"), newEntry);
    isUsingLocalStorage = false;
    return { id: docRef.id, ...newEntry };
  } catch (error) {
    console.warn("Could not save entry to Firebase, saving locally:", error.message);
    isUsingLocalStorage = true;

    const localEntries = getLocalEntries();
    const localItem = {
      id: "local_entry_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      ...newEntry,
    };
    localEntries.unshift(localItem);
    saveLocalEntries(localEntries);
    return localItem;
  }
}

// 3. Delete a single ledger entry
export async function deleteEntry(entryId) {
  try {
    await deleteDoc(doc(db, "ledger_entries", entryId));
  } catch (error) {
    console.warn("Could not delete entry from Firebase, deleting locally:", error.message);
    isUsingLocalStorage = true;
  }

  const localEntries = getLocalEntries().filter((e) => e.id !== entryId);
  saveLocalEntries(localEntries);
}
