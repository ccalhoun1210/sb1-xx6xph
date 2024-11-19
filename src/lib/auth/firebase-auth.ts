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
import { auth, db } from '../firebase';
import type { User } from '@/types/user';

// Helper function to check network connection
const checkNetworkConnection = async () => {
  if (!navigator.onLine) {
    throw new Error('No internet connection');
  }
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
    } else {
      await setDoc(userRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
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
    await ensureUserDocument(userCredential.user.uid, email);
    
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();

    return {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      name: userData.name || email.split('@')[0],
      role: userData.role || 'USER',
      companyId: userData.companyId
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
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

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

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

    await ensureUserDocument(userCredential.user.uid, email, subdomain, 'ADMIN');

    return {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      name: email.split('@')[0],
      role: 'ADMIN',
      companyId: subdomain
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    localStorage.removeItem('companyId');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const resetUserPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
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
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      await ensureUserDocument(user.uid, user.email!);
      return {
        id: user.uid,
        email: user.email!,
        name: user.email!.split('@')[0],
        role: 'USER',
        companyId: ''
      };
    }

    const userData = userDoc.data();
    return {
      id: user.uid,
      email: user.email!,
      name: userData.name || user.email!.split('@')[0],
      role: userData.role || 'USER',
      companyId: userData.companyId || ''
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};