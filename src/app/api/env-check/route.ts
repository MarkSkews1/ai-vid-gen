import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN
      ? `exists (length: ${process.env.REPLICATE_API_TOKEN.length})`
      : 'missing',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME
      ? 'exists'
      : 'missing',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'exists' : 'missing',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
      ? 'exists'
      : 'missing',
    USE_MOCK_GEMINI: process.env.USE_MOCK_GEMINI || 'not set',
    USE_MOCK_REPLICATE: process.env.USE_MOCK_REPLICATE || 'not set',
  };

  return NextResponse.json({
    message: 'Environment variables debug',
    envVars,
  });
}
