'use client';
import { signOut } from 'next-auth/react';
import React from 'react'

export default function SignOut() {
  return <button className='text-text-gray-600  py-2 hover:cursor-pointer hover:text-indigo-600' onClick={() => signOut()}>Sign Out</button>;
}
