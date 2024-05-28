

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(request: NextRequest) {
  const sessionToken = await getToken({ req: request, secret });
//   console.log('sessionToken', sessionToken)

  if (request.nextUrl.pathname.startsWith('/SignIn') && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/dashboard') && !sessionToken) {
    return NextResponse.redirect(new URL('/SignIn', request.url));
    }

  return NextResponse.next();
}