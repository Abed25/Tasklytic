// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getAuth } from "firebase/auth"; // For Authentication (if needed)
import { getAnalytics } from "firebase/analytics"; // For Analytics (optional)

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi86phlnyJHPxwiFCY96h7jTgUtUvDT2o",
  authDomain: "task-list-404e4.firebaseapp.com",
  projectId: "task-list-404e4",
  storageBucket: "task-list-404e4.firebasestorage.app",
  messagingSenderId: "1077518976683",
  appId: "1:1077518976683:web:9be88c96969cad655bd9ee",
  measurementId: "G-BPYRDHJ56P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication (optional)
const auth = getAuth(app);

export { app, analytics, db, auth };
