import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
  };

  return NextResponse.json({
    message: 'Environment variables debug',
    envVars,
  });
}
