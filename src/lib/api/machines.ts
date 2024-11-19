import {
  collection,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Machine } from '@/types/workOrder';

export async function getMachines() {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const q = query(
      collection(db, 'machines'),
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const machines = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const customer = await getDoc(doc.ref.collection('customers').doc(data.customerId));
        
        return {
          id: doc.id,
          ...data,
          customer: customer.data(),
        } as Machine;
      })
    );

    return machines;
  } catch (error) {
    console.error('Error fetching machines:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch machines');
  }
}

export async function getMachine(id: string) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const docRef = doc(db, 'machines', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error('Machine not found');

    const data = docSnap.data();
    const customer = await getDoc(doc(db, 'customers', data.customerId));

    return {
      id: docSnap.id,
      ...data,
      customer: customer.data(),
    } as Machine;
  } catch (error) {
    console.error('Error fetching machine:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch machine');
  }
}

export async function createMachine(machine: Partial<Machine>) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const docRef = await addDoc(collection(db, 'machines'), {
      ...machine,
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return getMachine(docRef.id);
  } catch (error) {
    console.error('Error creating machine:', error);
    throw error instanceof Error ? error : new Error('Failed to create machine');
  }
}

export async function updateMachine(id: string, updates: Partial<Machine>) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const docRef = doc(db, 'machines', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    return getMachine(id);
  } catch (error) {
    console.error('Error updating machine:', error);
    throw error instanceof Error ? error : new Error('Failed to update machine');
  }
}

export async function deleteMachine(id: string) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    await deleteDoc(doc(db, 'machines', id));
  } catch (error) {
    console.error('Error deleting machine:', error);
    throw error instanceof Error ? error : new Error('Failed to delete machine');
  }
}