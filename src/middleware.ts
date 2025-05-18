import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import type { NextRequest } from 'next/server';

export default withAuth(
  async function middleware(request: NextRequest) {
    console.log(request);
  },
  {
    isReturnedToCurrentPage: true,
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API Routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - auth
     * - favicon.ico
     * - robots.txt
     * - images
     * - login
     * - homepage (represented with $ after begining /)
     */
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|login|$).*)',
  ],
};
