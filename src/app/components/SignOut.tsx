'use client';
import { signOut } from 'next-auth/react';
import { FaSignOutAlt } from "react-icons/fa";
import React from 'react'

export default function SignOut() {
  return (
    <button
      className="flex items-center space-x-2 bg-transparent text-gray-500 hover:text-gray-700 py-2 px-3 font-bold rounded"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      <FaSignOutAlt className="text-xl" />
      <span>Sign Out</span>
    </button>
  )
}
