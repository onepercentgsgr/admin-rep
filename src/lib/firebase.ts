import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOPVvly4Q5A4UAbyNkQeTJbwwNNc48s9o",
  authDomain: "multirepuestos-9a661.firebaseapp.com",
  projectId: "multirepuestos-9a661",
  storageBucket: "multirepuestos-9a661.firebasestorage.app",
  messagingSenderId: "68700934010",
  appId: "1:68700934010:web:6bc5678ca1a3e7823c90c3",
  measurementId: "G-C51L3YT8BP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
