'use server';

// This is a temporary debug file to test environment variables

export async function debugEnvVars() {
  return {
    USE_MOCK_GEMINI: process.env.USE_MOCK_GEMINI,
    USE_MOCK_REPLICATE: process.env.USE_MOCK_REPLICATE,
    NODE_ENV: process.env.NODE_ENV,
    // Don't return sensitive values in production
    ...(process.env.NODE_ENV !== 'production' && {
      GEMINI_API_KEY_LENGTH: process.env.GEMINI_API_KEY
        ? process.env.GEMINI_API_KEY.length
        : 0,
    }),
  };
}
