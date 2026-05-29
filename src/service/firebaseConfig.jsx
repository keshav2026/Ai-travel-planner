import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9oiTcmtCAYs6B0x9bYRU1cZa1jwN6pw4",
  authDomain: "ai-travel-planner-787c4.firebaseapp.com",
  projectId: "ai-travel-planner-787c4",
  storageBucket: "ai-travel-planner-787c4.firebasestorage.app",
  messagingSenderId: "372841557916",
  appId: "1:372841557916:web:a0eacc98a5a3bcdea6a259",
  measurementId: "G-5GSGR3C8CR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);