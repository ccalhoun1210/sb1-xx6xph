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
import type { Customer } from '@/types/workOrder';

export async function getCustomers() {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const q = query(
      collection(db, 'customers'),
      where('companyId', '==', companyId),
      orderBy('name')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Customer[];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch customers');
  }
}

export async function getCustomer(id: string) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const docRef = doc(db, 'customers', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error('Customer not found');

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Customer;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch customer');
  }
}

export async function createCustomer(customer: Partial<Customer>) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const docRef = await addDoc(collection(db, 'customers'), {
      ...customer,
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return getCustomer(docRef.id);
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error instanceof Error ? error : new Error('Failed to create customer');
  }
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const docRef = doc(db, 'customers', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    return getCustomer(id);
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error instanceof Error ? error : new Error('Failed to update customer');
  }
}

export async function deleteCustomer(id: string) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    await deleteDoc(doc(db, 'customers', id));
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error instanceof Error ? error : new Error('Failed to delete customer');
  }
}