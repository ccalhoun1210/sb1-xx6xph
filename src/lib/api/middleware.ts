import { auth } from '../firebase';
import { ApiError } from './error';

export async function withAuth<T>(
  operation: () => Promise<T>
): Promise<T> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new ApiError('Unauthorized', 401);
  }

  const companyId = localStorage.getItem('companyId');
  if (!companyId) {
    throw new ApiError('Company ID not found', 401);
  }

  try {
    return await operation();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    
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
}