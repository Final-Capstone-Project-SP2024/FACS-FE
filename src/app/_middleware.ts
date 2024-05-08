import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export default async function _middleware(request : NextRequest) {
  const sessionToken = await getToken({ req: request, secret });
  console.log('sessionToken', sessionToken);
  if (request.nextUrl.pathname.startsWith('/SignIn') && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (request.nextUrl.pathname === '/') {
    console.log('Redirecting to /auth/SignIn');
    return NextResponse.redirect(new URL('/SignIn', request.url));
  }
  return NextResponse.next();
}