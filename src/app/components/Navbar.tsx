'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import SignOut from './SignOut'; // Make sure the path is correct
import { FiLogIn } from 'react-icons/fi';
import user from '../../../public/user-icon.png';

const Navbar = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="w-full">
      <div>
        <nav className="shadow">
          <div className="flex justify-between items-center py-2 px-5 container mx-auto">
            <div>
              <Link href="/dashboard" className="flex items-center bg-transparent text-gray-500 hover:text-gray-700 px-3 font-bold rounded">
                <Image src={logo} alt="" height="60" />
              </Link>
            </div>
            <div className="flex items-center">
              {session?.user ? (
                <div className="relative">
                  <div
                    className="rounded-full overflow-hidden h-10 w-10 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Image src={user} alt='logo' layout="responsive" />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                      <SignOut />
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/SignIn" className="flex items-center bg-transparent text-gray-500 hover:text-gray-700 py-2 px-3 font-bold rounded">
                  <FiLogIn className="mr-2" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;