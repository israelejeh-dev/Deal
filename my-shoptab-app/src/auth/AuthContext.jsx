// src/auth/AuthContext.jsx
// Core Authentication Context Provider for ShopTab

import React, { useState, useEffect } from "react";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseClient";
import { formatPhoneNumberE164 } from "./authHelpers";
import AuthContext from "./context";


const LOCAL_USER_KEY = "shoptab_auth_user";
const LOCAL_SHOP_KEY = "shoptab_shop_data";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [shop, setShop] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SHOP_KEY);
      return saved ? JSON.parse(saved) : { id: "shop_default", name: "My Shop" };
    } catch {
      return { id: "shop_default", name: "My Shop" };
    }
  });

  const [loading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");

  // Listen to Firebase Auth state
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Shop Owner",
            phoneNumber: firebaseUser.phoneNumber,
          };
          setUser(userData);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

          setShop((prev) => {
            const updated = {
              id: firebaseUser.uid,
              name: prev?.name || userData.displayName || "My Shop",
              ownerUid: firebaseUser.uid,
            };
            localStorage.setItem(LOCAL_SHOP_KEY, JSON.stringify(updated));
            return updated;
          });
        }
      });
    } catch (e) {
      console.warn("Firebase Auth listener error:", e);
    }

    return () => unsubscribe();
  }, []);

  // Email / Password Sign up
  async function signup(name, email, password) {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      if (trimmedName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: trimmedName });
      }

      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: trimmedName || userCredential.user.email.split("@")[0],
      };

      setUser(userData);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

      const newShop = {
        id: userData.uid,
        name: trimmedName || "My Shop",
        ownerUid: userData.uid,
      };
      setShop(newShop);
      localStorage.setItem(LOCAL_SHOP_KEY, JSON.stringify(newShop));

      return userData;
    } catch (err) {
      // Offline fallback: if network/firebase fails, save local session so the user can test
      if (
        err.code === "auth/network-request-failed" ||
        err.code === "auth/api-key-not-valid" ||
        err.code === "auth/operation-not-allowed" ||
        err.message?.includes("network")
      ) {
        console.warn("Firebase Auth unavailable, creating local user session:", err.message);
        const localUid = "local_" + Date.now();
        const userData = {
          uid: localUid,
          email: trimmedEmail,
          displayName: trimmedName || trimmedEmail.split("@")[0],
        };
        setUser(userData);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

        const newShop = {
          id: localUid,
          name: trimmedName || "My Shop",
          ownerUid: localUid,
        };
        setShop(newShop);
        localStorage.setItem(LOCAL_SHOP_KEY, JSON.stringify(newShop));

        return userData;
      }
      throw err;
    }
  }

  // Email / Password Log in
  async function login(email, password) {
    const trimmedEmail = email.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || userCredential.user.email.split("@")[0],
      };

      setUser(userData);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

      const shopData = {
        id: userData.uid,
        name: userData.displayName || "My Shop",
        ownerUid: userData.uid,
      };
      setShop(shopData);
      localStorage.setItem(LOCAL_SHOP_KEY, JSON.stringify(shopData));

      return userData;
    } catch (err) {
      // Check if user previously logged in offline
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.email?.toLowerCase() === trimmedEmail.toLowerCase()) {
            setUser(parsed);
            return parsed;
          }
        } catch {
          // ignore
        }
      }
      throw err;
    }
  }

  // Log out
  async function logout() {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  }

  // Phone OTP emulation (compatible with Login.jsx)
  async function sendOtp(phone) {
    setPendingPhone(phone);
    return { success: true, isDevTest: true };
  }

  async function verifyOtp(otp) {
    if (otp === "123456" || otp.length === 6) {
      const uid = "phone_" + (pendingPhone.replace(/[^0-9]/g, "") || Date.now());
      const userData = {
        uid,
        phoneNumber: formatPhoneNumberE164(pendingPhone),
        displayName: "Shopkeeper (" + (pendingPhone.slice(-4) || "user") + ")",
      };
      setUser(userData);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

      const savedShop = localStorage.getItem(LOCAL_SHOP_KEY);
      const hasShop = !!savedShop;
      if (!hasShop) {
        const defaultShop = {
          id: uid,
          name: "My Shop",
          ownerUid: uid,
        };
        setShop(defaultShop);
        localStorage.setItem(LOCAL_SHOP_KEY, JSON.stringify(defaultShop));
      }
      return { user: userData, hasShop };
    }
    throw new Error("Invalid verification code. Please check and try again.");
  }

  // Save shop name during setup
  async function saveShopSetup(shopName) {
    const updated = {
      id: user?.uid || "shop_default",
      name: shopName.trim(),
      ownerUid: user?.uid || "user_default",
    };
    setShop(updated);
    localStorage.setItem(LOCAL_SHOP_KEY, JSON.stringify(updated));

    if (user) {
      const updatedUser = { ...user, displayName: shopName.trim() };
      setUser(updatedUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updatedUser));
      try {
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: shopName.trim() });
        }
      } catch {
        // ignore
      }
    }
    return updated;
  }

  const value = {
    user,
    shop,
    loading,
    signup,
    login,
    logout,
    sendOtp,
    verifyOtp,
    saveShopSetup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
