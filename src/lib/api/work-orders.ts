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
import type { WorkOrder } from '@/types/workOrder';

export async function getWorkOrders() {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const q = query(
      collection(db, 'work_orders'),
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const workOrders = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // Get related documents
        const [customer, machine, technician] = await Promise.all([
          getDoc(doc.ref.collection('customers').doc(data.customerId)),
          getDoc(doc.ref.collection('machines').doc(data.machineId)),
          data.technicianId ? getDoc(doc.ref.collection('users').doc(data.technicianId)) : null
        ]);

        return {
          id: doc.id,
          ...data,
          customer: customer.data(),
          machine: machine.data(),
          technician: technician?.data() || null,
        } as WorkOrder;
      })
    );

    return workOrders;
  } catch (error) {
    console.error('Error fetching work orders:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch work orders');
  }
}

export async function getWorkOrder(id: string) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const docRef = doc(db, 'work_orders', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error('Work order not found');

    const data = docSnap.data();
    
    // Get related documents
    const [customer, machine, technician] = await Promise.all([
      getDoc(doc(db, 'customers', data.customerId)),
      getDoc(doc(db, 'machines', data.machineId)),
      data.technicianId ? getDoc(doc(db, 'users', data.technicianId)) : null
    ]);

    return {
      id: docSnap.id,
      ...data,
      customer: customer.data(),
      machine: machine.data(),
      technician: technician?.data() || null,
    } as WorkOrder;
  } catch (error) {
    console.error('Error fetching work order:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch work order');
  }
}

export async function createWorkOrder(workOrder: Partial<WorkOrder>) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const docRef = await addDoc(collection(db, 'work_orders'), {
      ...workOrder,
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return getWorkOrder(docRef.id);
  } catch (error) {
    console.error('Error creating work order:', error);
    throw error instanceof Error ? error : new Error('Failed to create work order');
  }
}

export async function updateWorkOrder(id: string, updates: Partial<WorkOrder>) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    const docRef = doc(db, 'work_orders', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    return getWorkOrder(id);
  } catch (error) {
    console.error('Error updating work order:', error);
    throw error instanceof Error ? error : new Error('Failed to update work order');
  }
}

export async function deleteWorkOrder(id: string) {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    await deleteDoc(doc(db, 'work_orders', id));
  } catch (error) {
    console.error('Error deleting work order:', error);
    throw error instanceof Error ? error : new Error('Failed to delete work order');
  }
}