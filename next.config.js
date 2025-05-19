/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Add server-only modules to fallback
      '@google/genai': false,
    };
    return config;
  },
  serverExternalPackages: ['@google/genai'],
};

module.exports = nextConfig;
