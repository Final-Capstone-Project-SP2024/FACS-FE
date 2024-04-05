'use client';
import { signOut } from 'next-auth/react';
import React from 'react'

export default function SignOut() {
  return <button className='bg-amber-700 text-white hover:cursor-pointer hover:bg-red-600 py-2 px-3 font-bold rounded' onClick={() => signOut()}>Sign Out</button>;
}
