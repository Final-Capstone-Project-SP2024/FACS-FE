import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/options";
import Link from "next/link";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  console.log(session?.user);
  return (
    <header className="w-full">
      <div>
        <nav className="shadow">
          <div className="flex justify-between items-center py-6 px-10 container mx-auto">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-tr from-indigo-600 to-green-600 bg-clip-text text-transparent hover:cursor-pointer">CodeNghiemTucKhongTroll</h1>
            </div>
            <div>
              <div className="hover:cursor-pointer sm:hidden">
                <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
                <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
                <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
              </div>
              <div className="flex items-center">

                <ul className="sm:flex space-x-4 hidden items-center">
                  <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">Home</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">About</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">Services</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">Products</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">Contact</a></li>
                </ul>
                <div>
                  {session?.user ? (
                    <div className="md:flex items-center hidden space-x-4 ml-8 lg:ml-12">
                      <h1 className="text-text-gray-600  py-2 hover:cursor-pointer hover:text-indigo-600">LOGOUT</h1>
                    </div>
                  ) : (
                    <div className="md:flex items-center hidden space-x-4 ml-8 lg:ml-12">
                      <Link href="/SignIn" className="text-text-gray-600  py-2 hover:cursor-pointer hover:text-indigo-600">Sign In</Link>
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
