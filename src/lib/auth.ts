import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase-config';
import type { User } from '@/types/user';

// Helper function to check network connection
const checkNetworkConnection = async () => {
  if (!navigator.onLine) {
    throw new Error('No internet connection');
  }
};

// Helper function to retry operations
const retryOperation = async <T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> => {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
  throw lastError;
};

// Helper function to create or update user document
const ensureUserDocument = async (
  uid: string, 
  email: string, 
  companyId?: string, 
  role: 'ADMIN' | 'USER' = 'USER'
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        email,
        name: email.split('@')[0],
        role,
        companyId,
        active: true,
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Created new user document:', uid);
    } else {
      // Update last login
      await setDoc(userRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('Updated user document:', uid);
    }
  } catch (error) {
    console.error('Error in ensureUserDocument:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    await checkNetworkConnection();
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user.uid);
    
    // Ensure user document exists and is up to date
    await ensureUserDocument(userCredential.user.uid, email);
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found even after creation attempt');
    }

    const userData = userDoc.data();
    
    // Store company ID in localStorage if it exists
    if (userData.companyId) {
      localStorage.setItem('companyId', userData.companyId);
    }

    return {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      name: userData.name || email.split('@')[0],
      role: userData.role || 'USER',
      companyId: userData.companyId
    };
  } catch (error: any) {
    console.error('Sign in error:', {
      code: error.code,
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

export const signUp = async (
  email: string,
  password: string,
  companyName: string,
  subdomain: string
): Promise<User> => {
  try {
    await checkNetworkConnection();
    await setPersistence(auth, browserLocalPersistence);

    // Create user with Firebase Auth
    const userCredential = await retryOperation(async () => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', credential.user.uid);
      return credential;
    });

    // Create company document
    await retryOperation(async () => {
      await setDoc(doc(db, 'companies', subdomain), {
        name: companyName,
        subdomain,
        plan: 'BASIC',
        status: 'ACTIVE',
        maxUsers: 5,
        maxStorage: 5368709120, // 5GB in bytes
        storageUsed: 0,
        settings: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Company document created:', subdomain);
    });

    // Create user document with retry
    await retryOperation(async () => {
      await ensureUserDocument(userCredential.user.uid, email, subdomain, 'ADMIN');
    });

    return {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      name: email.split('@')[0],
      role: 'ADMIN',
      companyId: subdomain
    };
  } catch (error: any) {
    console.error('Sign up error:', {
      code: error.code,
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    localStorage.removeItem('companyId');
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent');
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

export const updateUserPassword = async (password: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await updatePassword(user, password);
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('No current user found');
      return null;
    }

    // Ensure user document exists
    await ensureUserDocument(user.uid, user.email!);

    // Get user data
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      console.error('No user document found even after creation attempt');
      return null;
    }

    const userData = userDoc.data();
    console.log('Current user data retrieved:', user.uid);

    return {
      id: user.uid,
      email: user.email!,
      name: userData.name || user.email!.split('@')[0],
      role: userData.role || 'USER',
      companyId: userData.companyId
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void): () => void => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await getCurrentUser();
        callback(user);
      } catch (error) {
        console.error('Auth state change error:', error);
        callback(null);
      }
    } else {
      console.log('No user signed in');
      callback(null);
    }
  });
};