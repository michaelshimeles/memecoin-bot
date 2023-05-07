import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://dda5bf57e020407da1f927b464541a23@o4505143961649152.ingest.sentry.io/4505143963287552",

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  tracesSampleRate: 1.0,

  integrations: [new Sentry.Replay()],
});