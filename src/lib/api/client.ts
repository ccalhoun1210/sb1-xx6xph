import { db } from '../firebase';
import type { ApiError } from './error';

export function handleError(error: any): never {
  if (error.code === 'permission-denied') {
    throw new ApiError('Unauthorized', 401);
  }
  
  if (error.code === 'not-found') {
    throw new ApiError('Not found', 404);
  }
  
  throw new ApiError(
    error.message || 'An unexpected error occurred',
    error.status || 500
  );
}