'use client';

import { browserTracingIntegration, replayIntegration } from '@sentry/browser';
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENVIRONMENT =
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development';

if (typeof window !== 'undefined' && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.05 : 0.1,
    integrations: [
      browserTracingIntegration(),
      replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });
}

export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>,
) => {
  if (process.env.NODE_ENV === 'development') {
    // biome-ignore lint/suspicious/noConsole: this is for development logging
    console.log('[Analytics]', eventName, properties);
  }
};

export const trackPageView = (pagePath: string) => {
  trackEvent('page_view', { page_path: pagePath });
};

export const trackPackageView = (packageId: string, packageName: string) => {
  trackEvent('package_view', {
    package_id: packageId,
    package_name: packageName,
  });
};

export const trackBookingStart = (packageId: string, packageName: string) => {
  trackEvent('booking_start', {
    package_id: packageId,
    package_name: packageName,
  });
};

export const trackBookingComplete = (
  bookingId: string,
  packageId: string,
  amount: number,
) => {
  trackEvent('booking_complete', {
    booking_id: bookingId,
    package_id: packageId,
    amount,
  });
};

export const trackWishlistToggle = (
  packageId: string,
  packageName: string,
  added: boolean,
) => {
  trackEvent('wishlist_toggle', {
    package_id: packageId,
    package_name: packageName,
    action: added ? 'added' : 'removed',
  });
};
