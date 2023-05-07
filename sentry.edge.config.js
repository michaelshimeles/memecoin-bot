import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://dda5bf57e020407da1f927b464541a23@o4505143961649152.ingest.sentry.io/4505143963287552",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});