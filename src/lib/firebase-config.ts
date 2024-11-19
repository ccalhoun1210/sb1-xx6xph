import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Clean up any existing Firebase apps to prevent initialization issues
getApps().forEach(app => {
  try {
    deleteApp(app);
  } catch (error) {
    console.warn('Error deleting Firebase app:', error);
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyB2hi9-gXnVtmRruoBXz6tNGXJZkRbNbX4",
  authDomain: "rbworkbench.firebaseapp.com",
  projectId: "rbworkbench",
  storageBucket: "rbworkbench.firebasestorage.app",
  messagingSenderId: "691171830316",
  appId: "1:691171830316:web:9f0027418cb8ddfc597f89",
  measurementId: "G-51BZLPJ0C3",
  databaseURL: "https://rbworkbench.firebaseio.com"
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Auth with persistence and error handling
let auth;
try {
  auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver
  });
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Auth:', error);
  // Fallback to basic auth if enhanced auth fails
  auth = getAuth(app);
}

// Initialize Firestore with optimized settings
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize other Firebase services
const storage = getStorage(app);
const database = getDatabase(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('Firebase Analytics initialized successfully');
      }
    })
    .catch(error => {
      console.warn('Analytics initialization failed:', error);
    });
}

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectDatabaseEmulator(database, 'localhost', 9000);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.warn('Error connecting to emulators:', error);
  }
}

export { app, auth, db, storage, database, analytics };