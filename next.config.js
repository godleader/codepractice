// next.config.js

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
