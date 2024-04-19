'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AiOutlineAppstore } from 'react-icons/ai';
import { FaCamera, FaRegUser } from 'react-icons/fa';
import { MdLocationCity, MdWorkHistory } from 'react-icons/md';

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-56 overflow-auto border-r border-gray-300 bg-white">
            <Link href="/dashboard">
                <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer ${pathname === '/dashboard' ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-500 hover:text-white'}`}>
                    <AiOutlineAppstore className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Overview</h1>
                </div>
            </Link>
            <Link href="/dashboard/user">
                <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname === '/dashboard/user' ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-400 hover:text-white'}`}>
                    <FaRegUser className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Users</h1>
                </div>
            </Link>
            <Link href="/dashboard/camera">
                <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname === '/dashboard/camera' ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-400 hover:text-white'}`}>
                    <FaCamera className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Camera</h1>
                </div>
            </Link>
            <Link href="/dashboard/location">
                <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname === '/dashboard/location' ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-400 hover:text-white'}`}>
                    <MdLocationCity className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Location</h1>
                </div>
            </Link>
            <Link href="/dashboard/record">
                <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname === '/dashboard/record' ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-500 hover:text-white'}`}>
                    <MdWorkHistory className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Record</h1>
                </div>
            </Link>
        </div>
    )
}