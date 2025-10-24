import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDvUfSOQGzc8paMozowyavbooLNCh3t9FE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "seguridad-ciudadana-71a1b.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "seguridad-ciudadana-71a1b",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "seguridad-ciudadana-71a1b.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "872922357440",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:872922357440:web:104e865e46556603d3d725",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-HFEYHG53H6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only in production
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
