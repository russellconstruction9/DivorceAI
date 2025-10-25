import { initializeApp, getApp, getApps } from 'firebase/app.js';
import type { FirebaseApp } from 'firebase/app.js';
import { getAuth } from 'firebase/auth.js';
import type { Auth } from 'firebase/auth.js';
import { getFirestore } from 'firebase/firestore.js';
import type { Firestore } from 'firebase/firestore.js';
import { getStorage } from 'firebase/storage.js';
import type { FirebaseStorage } from 'firebase/storage.js';

// A promise that resolves with the Firebase app instance.
const firebaseAppPromise: Promise<FirebaseApp> = new Promise(async (resolve, reject) => {
    if (getApps().length) {
        resolve(getApp());
        return;
    }

    try {
        const response = await fetch('/__/firebase/init.json');
        if (!response.ok) {
            // Fallback for local dev - this app has no env vars so this is expected outside firebase hosting
            console.warn('Firebase config not found at /__/firebase/init.json. This is expected in local development. Firebase services will be unavailable.');
            reject('Firebase config not found');
            return;
        }
        const config = await response.json();
        const app = initializeApp(config);
        resolve(app);
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        reject(error);
    }
});

// We can export async getters for the services to ensure they are initialized.
export const getFirebaseApp = (): Promise<FirebaseApp> => firebaseAppPromise;
export const getFirebaseAuth = (): Promise<Auth> => firebaseAppPromise.then(getAuth);
export const getFirebaseDb = (): Promise<Firestore> => firebaseAppPromise.then(getFirestore);
export const getFirebaseStorage = (): Promise<FirebaseStorage> => firebaseAppPromise.then(getStorage);
