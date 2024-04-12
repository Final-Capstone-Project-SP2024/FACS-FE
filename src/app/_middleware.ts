import { NextRequest, NextResponse } from 'next/server';

export default function _middleware(request : NextRequest) {
  console.log('Middleware triggered on path:', request.nextUrl.pathname);
  if (request.nextUrl.pathname === '/') {
    console.log('Redirecting to /auth/SignIn');
    return NextResponse.redirect(new URL('/SignIn', request.url));
  }
  return NextResponse.next();
}