'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import SignOut from './SignOut';
import { FiLogIn } from 'react-icons/fi';
import user from '../../../public/user-icon.png';
import { IoIosNotifications } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';

const Navbar = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="w-full shadow-md">
      <nav className="container mx-auto flex flex-row justify-between items-center py-3 px-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center text-gray-700 hover:text-gray-900">
            <Image src={logo} alt="Logo" width={120} height={120} />
          </Link>
          <div className="relative w-full max-w-xl ml-20">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-md py-1 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <CiSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="relative">
              <div className="flex items-center gap-4">
                <IoIosNotifications className="text-2xl text-gray-600 hover:text-red-500 cursor-pointer" />

                <div
                  className="rounded-full overflow-hidden w-10 h-10 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Image src={user} alt="User" width={40} height={40} layout="responsive" />
                </div>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                  <div className="px-4 py-2 text-gray-800 border-b border-gray-300">
                    Welcome, {session?.user.data.name}
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-100">
                    <SignOut />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/SignIn" className="flex items-center text-gray-700 hover:text-gray-900 py-2 px-3">
              <FiLogIn className="mr-2" /> Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
