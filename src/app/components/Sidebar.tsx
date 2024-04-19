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
        <div className="flex flex-col w-56 overflow-auto border-r border-gray-300">
            <Link href="/dashboard" className={`link ${pathname === '/dashboard' ? 'bg-[#fe9e9e]' : ''}`}>
                <div className="flex items-center w-full h-16 gap-1 px-5 hover:bg-[#f97171] active:bg-[#EF4444] cursor-pointer">
                    <AiOutlineAppstore className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Overview</h1>
                </div>
            </Link>
            <Link href="/dashboard/user" className={`link ${pathname === '/dashboard/user' ? 'bg-[#fe9e9e]' : ''}`}>
                <div className="flex items-center w-full h-16 gap-1 px-5 rounded hover:bg-[#f97171] active:bg-[#EF4444] cursor-pointer">
                    <FaRegUser className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Users</h1>
                </div>
            </Link>
            <Link href="/dashboard/camera" className={`link ${pathname === '/dashboard/camera' ? 'bg-[#fe9e9e]' : ''}`}>
                <div className="flex items-center w-full h-16 gap-1 px-5 rounded hover:bg-[#f97171] active:bg-[#EF4444] cursor-pointer">
                    <FaCamera className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Camera</h1>
                </div>
            </Link>
            <Link href="/dashboard/location" className={`link ${pathname === '/dashboard/location' ? 'bg-[#fe9e9e]' : ''}`}>
                <div className="flex items-center w-full h-16 gap-1 px-5 rounded hover:bg-[#f97171] active:bg-[#EF4444] cursor-pointer">
                    <MdLocationCity className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Location</h1>
                </div>
            </Link>
            <Link href="/dashboard/record" className={`link ${pathname === '/dashboard/record' ? 'bg-[#fe9e9e]' : ''}`}>
                <div className="flex items-center w-full h-16 gap-1 px-5 rounded hover:bg-[#f97171] active:bg-[#EF4444] cursor-pointer">
                    <MdWorkHistory className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Record</h1>
                </div>
            </Link>
        </div>
    )
}