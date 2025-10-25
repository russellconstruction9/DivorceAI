import { initializeApp, getApp, getApps } from 'firebase/app.js';
import type { FirebaseApp } from 'firebase/app.js';
import { getAuth } from 'firebase/auth.js';
import type { Auth } from 'firebase/auth.js';
import { getFirestore } from 'firebase/firestore.js';
import type { Firestore } from 'firebase/firestore.js';
import { getStorage } from 'firebase/storage.js';
import type { FirebaseStorage } from 'firebase/storage.js';
import { getAnalytics } from 'firebase/analytics.js';
import type { Analytics } from 'firebase/analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVXwSeyhCXUFoYe_ZbWGBlcFwqpK7MhbU",
  authDomain: "custodyx-54d90.firebaseapp.com",
  projectId: "custodyx-54d90",
  storageBucket: "custodyx-54d90.firebasestorage.app",
  messagingSenderId: "171606726545",
  appId: "1:171606726545:web:04b0d94872c40d6cefac30",
  measurementId: "G-ZQC4VRZX9Z"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Analytics
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Export Firebase services
export const getFirebaseApp = (): FirebaseApp => app;
export const getFirebaseAuth = (): Auth => getAuth(app);
export const getFirebaseDb = (): Firestore => getFirestore(app);
export const getFirebaseStorage = (): FirebaseStorage => getStorage(app);
export const getFirebaseAnalytics = (): Analytics | undefined => analytics;

// Export the app instance directly for convenience
export { app };
