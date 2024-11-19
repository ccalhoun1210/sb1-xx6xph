import {
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  type Query,
  type DocumentData
} from 'firebase/firestore';
import { companiesRef, customersRef, machinesRef, workOrdersRef } from './collections';

// Helper function to get company ID
const getCompanyId = () => {
  const companyId = localStorage.getItem('companyId');
  if (!companyId) throw new Error('No company ID found');
  return companyId;
};

// Work Order queries
export const getWorkOrdersQuery = (status?: string) => {
  const baseQuery = query(
    workOrdersRef,
    where('companyId', '==', getCompanyId()),
    orderBy('createdAt', 'desc')
  );

  return status 
    ? query(baseQuery, where('status', '==', status))
    : baseQuery;
};

export const getTechnicianWorkOrdersQuery = (technicianId: string) => {
  return query(
    workOrdersRef,
    where('companyId', '==', getCompanyId()),
    where('technicianId', '==', technicianId),
    orderBy('createdAt', 'desc')
  );
};

// Customer queries
export const getCustomersQuery = () => {
  return query(
    customersRef,
    where('companyId', '==', getCompanyId()),
    orderBy('name')
  );
};

// Machine queries
export const getMachinesQuery = (customerId?: string) => {
  const baseQuery = query(
    machinesRef,
    where('companyId', '==', getCompanyId())
  );

  return customerId
    ? query(baseQuery, where('customerId', '==', customerId))
    : baseQuery;
};

// Pagination helper
export async function getPaginatedResults<T>(
  baseQuery: Query<T, DocumentData>,
  pageSize: number,
  lastDoc?: DocumentData
) {
  const paginatedQuery = lastDoc
    ? query(baseQuery, limit(pageSize), startAfter(lastDoc))
    : query(baseQuery, limit(pageSize));

  const snapshot = await getDocs(paginatedQuery);
  
  return {
    items: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === pageSize,
  };
}