import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvUfSOQGzc8paMozowyavbooLNCh3t9FE",
  authDomain: "seguridad-ciudadana-71a1b.firebaseapp.com",
  projectId: "seguridad-ciudadana-71a1b",
  storageBucket: "seguridad-ciudadana-71a1b.appspot.com",
  messagingSenderId: "872922357440",
  appId: "1:872922357440:web:104e865e46556603d3d725",
  measurementId: "G-HFEYHG53H6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
