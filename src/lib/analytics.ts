import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

interface PageView {
  path: string;
  timestamp: string;
  userId?: string;
}

interface Event {
  name: string;
  properties: Record<string, any>;
  timestamp: string;
  userId?: string;
}

export const trackPageView = (path: string, userId?: string) => {
  const pageView: PageView = {
    path,
    timestamp: new Date().toISOString(),
    userId,
  };

  logEvent(analytics, 'page_view', pageView);
};

export const trackEvent = (name: string, properties: Record<string, any>, userId?: string) => {
  const event: Event = {
    name,
    properties,
    timestamp: new Date().toISOString(),
    userId,
  };

  logEvent(analytics, name, event);
};