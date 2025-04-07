


// firebaseConfig.jsx (Ensure this file is using the modular SDK correctly)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD85ccZj0GBgcq3hECN-d-9GWQWpmJNP-E",
  authDomain: "yss-eparcha.firebaseapp.com",
  projectId: "yss-eparcha",
  storageBucket: "yss-eparcha.firebasestorage.app",
  messagingSenderId: "694779508998",
  appId: "1:694779508998:web:503faffd788432ac8f8687",
  measurementId: "G-M4GR5T7YV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
export { auth, db, storage };

