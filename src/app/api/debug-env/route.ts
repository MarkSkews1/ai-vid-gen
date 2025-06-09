import { debugEnvVars } from '@/actions/debug-env';
import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = await debugEnvVars();

  return NextResponse.json({
    message: 'Environment variables debug',
    envVars,
  });
}
