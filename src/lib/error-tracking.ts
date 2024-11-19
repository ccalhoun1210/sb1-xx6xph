import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: string;
  userAgent: string;
  path: string;
}

export const reportError = async (error: Error, context?: any) => {
  const errorReport: ErrorReport = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    path: window.location.pathname,
  };

  // Log error to Firebase Analytics
  logEvent(analytics, 'error', {
    ...errorReport,
    context,
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Report:', errorReport);
    if (context) {
      console.error('Error Context:', context);
    }
  }
};