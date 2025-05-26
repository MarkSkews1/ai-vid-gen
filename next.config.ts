import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    USE_MOCK_GEMINI: process.env.USE_MOCK_GEMINI,
    ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY,
  },
  serverRuntimeConfig: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    USE_MOCK_GEMINI: process.env.USE_MOCK_GEMINI,
    ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY,
  },
  // Ensure output is fully cleaned on build
  cleanDistDir: true,
  // Add transpilePackages to handle cloudinary
  transpilePackages: ['cloudinary'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // We're in the browser build, so we need to handle Node.js modules

      // Add cloudinary to externals to prevent webpack from bundling it
      const externals = [...(config.externals || [])];

      // Use a simpler approach - just add cloudinary as a string external
      externals.push('cloudinary');

      config.externals = externals;

      // Provide fallbacks for Node.js core modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
        os: false,
        http: false,
        https: false,
        zlib: false,
        util: false,
        child_process: false,
        url: false,
      };

      // Add a null module for cloudinary
      config.resolve.alias = {
        ...config.resolve.alias,
        cloudinary: false,
      };
    }

    return config;
  },
};

export default nextConfig;
