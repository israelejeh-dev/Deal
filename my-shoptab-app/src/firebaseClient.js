import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCclyVrsKTD6WifPRcaQAmRhdV1_gBZ-2I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "my-junk-b3241.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "my-junk-b3241",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "my-junk-b3241.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "791245136276",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:791245136276:web:de4ca1a616cd7ca5a1ef81",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

