import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadFile = async (file: File, type: 'image' | 'document' = 'image') => {
  try {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) throw new Error('No company ID found');

    // Create a reference to the file location
    const fileRef = ref(storage, `${companyId}/${type}s/${Date.now()}-${file.name}`);

    // Upload the file
    const snapshot = await uploadBytes(fileRef, file);

    // Get the download URL
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
};

export const validateFile = (file: File, type: 'image' | 'document' = 'image') => {
  const maxSize = type === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for images, 10MB for documents
  
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  const allowedTypes = type === 'image' 
    ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }

  return true;
};