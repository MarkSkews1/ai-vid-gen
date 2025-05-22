import { debugEnvVars } from '@/actions/debug-env';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const envVars = await debugEnvVars();

  return NextResponse.json({
    message: 'Environment variables debug',
    envVars,
  });
}
