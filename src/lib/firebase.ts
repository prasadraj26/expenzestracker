import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyByv4J2GrAux16XunZEx4v3bOPOxmilImA",
  authDomain: "expenzestracker.firebaseapp.com",
  projectId: "expenzestracker",
  storageBucket: "expenzestracker.firebasestorage.app",
  messagingSenderId: "179529656262",
  appId: "1:179529656262:web:6c6e041fbf1f0200e0b4c7",
  measurementId: "G-NWHF5FT1Y8"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
