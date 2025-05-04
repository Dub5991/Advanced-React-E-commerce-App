import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjPCePwgebCrD4brRDxJmW60eHHJRipVQ",
  authDomain: "advanced-e-commerce.firebaseapp.com",
  projectId: "advanced-e-commerce",
  storageBucket: "advanced-e-commerce.firebasestorage.app",
  messagingSenderId: "792570966056",
  appId: "1:792570966056:web:ae85f1d759ba93fe85851d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

export { auth, db }; // Export both auth and db

