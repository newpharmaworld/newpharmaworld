import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Environment configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCT_utCS2OOfj1zd7YpGP3oZRfMyp_UNc8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "new-pharma-world.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "new-pharma-world",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "new-pharma-world.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "221006395343",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:221006395343:web:b96d88d19ce269d1e484ba",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WNRFLP2YFZ"
};

// Initialize Firebase App singleton
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Optional Analytics (only in browser environments where supported)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics error in restricted sandbox
  });
}
