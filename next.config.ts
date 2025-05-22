import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    USE_MOCK_GEMINI: process.env.USE_MOCK_GEMINI,
  },
  serverRuntimeConfig: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    USE_MOCK_GEMINI: process.env.USE_MOCK_GEMINI,
  },
};

export default nextConfig;
