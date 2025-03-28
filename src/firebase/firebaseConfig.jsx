import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD85ccZj0GBgcq3hECN-d-9GWQWpmJNP-E",
  authDomain: "yss-eparcha.firebaseapp.com",
  projectId: "yss-eparcha",
  storageBucket: "yss-eparcha.firebasestorage.app",
  messagingSenderId: "694779508998",
  appId: "1:694779508998:web:503faffd788432ac8f8687",
  measurementId: "G-M4GR5T7YV0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// If you need `fire` object, initialize it, but currently it is not defined in your code
// Example: const fire = getSomeService(app);

export { auth, db, storage };

