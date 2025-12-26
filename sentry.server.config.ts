import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 1.0,

  environment: process.env.NODE_ENV,

  enabled: process.env.NODE_ENV === 'production',

  ignoreErrors: [
    'ECONNRESET',
    'ETIMEDOUT',
  ],

  beforeSend(event) {
    // 在服务器端，移除敏感信息
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.cookie;
        delete event.request.headers.authorization;
      }
    }
    return event;
  },
});
