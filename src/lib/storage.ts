import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

interface UploadOptions {
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

const DEFAULT_OPTIONS: UploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
};

export async function uploadFile(
  file: File,
  options: UploadOptions = DEFAULT_OPTIONS
): Promise<string> {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    // Validate file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new Error(`File size must be less than ${options.maxSize / (1024 * 1024)}MB`);
    }

    // Validate file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${options.allowedTypes.join(', ')}`);
    }

    // Create storage path
    const path = options.folder
      ? `${companyId}/${options.folder}/${Date.now()}-${file.name}`
      : `${companyId}/${Date.now()}-${file.name}`;

    // Upload file
    const fileRef = ref(storage, path);
    const snapshot = await uploadBytes(fileRef, file);

    // Get download URL
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Upload error:', error);
    throw error instanceof Error ? error : new Error('Failed to upload file');
  }
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Delete error:', error);
    throw error instanceof Error ? error : new Error('Failed to delete file');
  }
}

export async function uploadWorkOrderPhoto(
  workOrderId: string,
  file: File
): Promise<string> {
  return uploadFile(file, {
    folder: `work-orders/${workOrderId}/photos`,
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
}

export async function uploadWorkOrderDocument(
  workOrderId: string,
  file: File
): Promise<string> {
  return uploadFile(file, {
    folder: `work-orders/${workOrderId}/documents`,
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  });
}