import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

export const measurePerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const metrics = {
      // Time to First Byte
      ttfb: navigation.responseStart - navigation.requestStart,
      
      // First Contentful Paint
      fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
      
      // DOM Load
      domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      
      // Page Load
      pageLoad: navigation.loadEventEnd - navigation.loadEventStart,
    };

    // Log performance metrics to Firebase Analytics
    logEvent(analytics, 'performance_metrics', metrics);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metrics);
    }
  }
};