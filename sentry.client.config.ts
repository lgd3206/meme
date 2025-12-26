import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 设置采样率
  tracesSampleRate: 1.0,

  // 设置环境
  environment: process.env.NODE_ENV,

  // 只在生产环境启用
  enabled: process.env.NODE_ENV === 'production',

  // 忽略某些错误
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],

  // 在发送前处理事件
  beforeSend(event, hint) {
    // 过滤掉一些不重要的错误
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message);
        if (message.includes('ResizeObserver')) {
          return null;
        }
      }
    }
    return event;
  },
});
