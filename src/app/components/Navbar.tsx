import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/options";
import Link from "next/link";
import { SignOut } from ".";
import logo from '../../../public/logo.png';
import Image from 'next/image';

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  // console.log(session?.user);
  return (
    <header className="w-full">
      <div>
        <nav className="shadow">
          <div className="flex justify-between items-center py-2 px-5 container mx-auto">
            <div>
              <a href="/dashboard" className="text-2xl font-bold bg-gradient-to-tr from-red-500 to-yellow-600 bg-clip-text text-transparent hover:cursor-pointer"><Image src={logo} alt="" height="60"/></a>
            </div>
            <div>
              <div className="hover:cursor-pointer sm:hidden">
                <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
                <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
                <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
              </div>
              <div className="flex items-center">
                <div>
                  {session?.user ? (
                    <div className="md:flex items-center hidden space-x-4 ml-8 lg:ml-12">
                      <h1 className="text-text-gray-600  py-2 hover:cursor-pointer hover:text-indigo-600">Welcome back, {session.user.data.name}!</h1>
                      <SignOut />
                    </div>
                  ) : (
                    <div className="md:flex items-center hidden space-x-4 ml-8 lg:ml-12">
                      <Link href="/SignIn" className="bg-amber-700 text-white hover:cursor-pointer hover:bg-red-600 py-2 px-3 font-bold rounded">Sign In</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )

}
