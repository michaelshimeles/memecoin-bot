import * as Sentry from "@sentry/nextjs";
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://dda5bf57e020407da1f927b464541a23@o4505143961649152.ingest.sentry.io/4505143963287552",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0, // Profiling sample rate is relative to tracesSampleRate
  integrations: [
    // Add profiling integration to list of integrations
    new ProfilingIntegration(),
  ],
  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});