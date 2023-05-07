const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  future: {
    webpack5: true,
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  sentry: {
    // Optional build-time configuration options
    // See the sections below for information on the following options:
    //   'Configure Source Maps':
    //     - disableServerWebpackPlugin
    //     - disableClientWebpackPlugin
    //     - hideSourceMaps
    //     - widenClientFileUpload
    //   'Configure Legacy Browser Support':
    //     - transpileClientSDK
    //   'Configure Serverside Auto-instrumentation':
    //     - autoInstrumentServerFunctions
    //     - excludeServerRoutes
    //   'Configure Tunneling to avoid Ad-Blockers':
    //     - tunnelRoute
    tunnelRoute: "/monitoring-tunnel",
  },
};

const sentryWebpackPluginOptions = {
  org: "exodus-labs",
  project: "javascript-nextjs",
  silent: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
