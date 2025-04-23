// Import necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // For Authentication
import { getAnalytics } from "firebase/analytics"; // Optional for Analytics

// Firebase configuration (using environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication (optional)
const auth = getAuth(app);

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db)
  .then(() => {
    console.log("Offline persistence enabled.");
  })
  .catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled in one
      console.log("Persistence failed: multiple tabs open.");
    } else if (err.code === "unimplemented") {
      // Browser doesn't support all features required
      console.log("Persistence is not available in this browser.");
    }
  });

// Export Firebase services for use in your app
export { app, analytics, db, auth };
