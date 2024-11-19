import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { User } from '@/types/user';

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();
    
    // Update last login
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });

    // Store company ID in localStorage
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
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}