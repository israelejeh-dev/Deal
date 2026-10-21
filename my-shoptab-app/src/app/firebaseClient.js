// firebaseClient.js
// Sets up Firebase and Cloud Firestore
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Read configuration from the .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "placeholder-api-key",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: import.meta.env.VITE_PROJECT_ID || "placeholder",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_APP_ID || "",
  measurementId: import.meta.env.VITE_MEASUREMENT_ID || "",
};

// Initialize Firebase (safely checking if it was already initialized)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Export the Firestore database instance
export const db = getFirestore(app);
