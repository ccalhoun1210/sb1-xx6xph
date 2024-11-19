import { collection } from 'firebase/firestore';
import { db } from '../firebase';

// Define collection references
export const companiesRef = collection(db, 'companies');
export const usersRef = collection(db, 'users');
export const customersRef = collection(db, 'customers');
export const machinesRef = collection(db, 'machines');
export const workOrdersRef = collection(db, 'work_orders');
export const partsRef = collection(db, 'parts');
export const messagesRef = collection(db, 'messages');

// Collection path helpers
export const getCompanyPath = (companyId: string) => `companies/${companyId}`;
export const getUserPath = (userId: string) => `users/${userId}`;
export const getCustomerPath = (customerId: string) => `customers/${customerId}`;
export const getMachinePath = (machineId: string) => `machines/${machineId}`;
export const getWorkOrderPath = (workOrderId: string) => `work_orders/${workOrderId}`;
export const getPartPath = (workOrderId: string, partId: string) => 
  `work_orders/${workOrderId}/parts/${partId}`;
export const getMessagePath = (workOrderId: string, messageId: string) => 
  `work_orders/${workOrderId}/messages/${messageId}`;