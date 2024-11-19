export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: any): never {
  if (error.code === 'permission-denied') {
    throw new ApiError('Unauthorized', 401, error.code);
  }
  
  if (error.code === 'not-found') {
    throw new ApiError('Not Found', 404, error.code);
  }
  
  if (error.code?.startsWith('firestore/')) {
    throw new ApiError('Database Error', 500, error.code);
  }
  
  throw new ApiError(
    error.message || 'An unexpected error occurred',
    error.status || 500,
    error.code
  );
}