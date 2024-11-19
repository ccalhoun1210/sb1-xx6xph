import { 
  QueryDocumentSnapshot, 
  SnapshotOptions,
  DocumentData,
  FirestoreDataConverter
} from 'firebase/firestore';
import type { 
  CompanyDoc, 
  UserDoc, 
  CustomerDoc,
  MachineDoc,
  WorkOrderDoc,
  PartDoc,
  MessageDoc 
} from './schema';

// Helper function to create converters
function createConverter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): DocumentData {
      return data;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): T {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as T;
    },
  };
}

// Create converters for each collection
export const companyConverter = createConverter<CompanyDoc>();
export const userConverter = createConverter<UserDoc>();
export const customerConverter = createConverter<CustomerDoc>();
export const machineConverter = createConverter<MachineDoc>();
export const workOrderConverter = createConverter<WorkOrderDoc>();
export const partConverter = createConverter<PartDoc>();
export const messageConverter = createConverter<MessageDoc>();