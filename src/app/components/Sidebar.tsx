'use client'
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiOutlineAppstore } from 'react-icons/ai';
import { FaCamera, FaRegUser, FaSignOutAlt } from 'react-icons/fa';
import { MdLocationCity, MdWorkHistory, MdSettings, MdNotifications } from 'react-icons/md';
import Setting from './Setting';

export default function Sidebar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            const remInPixels = 16 * 4; // 4 rem

            if (position > remInPixels) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`fixed ${isScrolled ? 'top-0' : 'top-16'} flex flex-col justify-between w-56 h-screen overflow-auto border-r border-gray-300 bg-white transition-all duration-300 ease-in-out z-30`}>
            <div >
                <Link href="/dashboard">
                    <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname === '/dashboard' ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-500 hover:text-white'}`}>
                        <AiOutlineAppstore className='text-xl mr-2' />
                        <h1 className='text-base font-bold'>Overview</h1>
                    </div>
                </Link>
                <Link href="/dashboard/user">
                    <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname.startsWith('/dashboard/user') ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-400 hover:text-white'}`}>
                        <FaRegUser className='text-xl mr-2' />
                        <h1 className='text-base font-bold'>Users</h1>
                    </div>
                </Link>
                <Link href="/dashboard/camera">
                    <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname.startsWith('/dashboard/camera') ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-400 hover:text-white'}`}>
                        <FaCamera className='text-xl mr-2' />
                        <h1 className='text-base font-bold'>Camera</h1>
                    </div>
                </Link>
                <Link href="/dashboard/location">
                    <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname.startsWith('/dashboard/location') ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-400 hover:text-white'}`}>
                        <MdLocationCity className='text-xl mr-2' />
                        <h1 className='text-base font-bold'>Location</h1>
                    </div>
                </Link>
                <Link href="/dashboard/record">
                    <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname.startsWith('/dashboard/record') ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-500 hover:text-white'}`}>
                        <MdWorkHistory className='text-xl mr-2' />
                        <h1 className='text-base font-bold'>Record</h1>
                    </div>
                </Link>
                <Link href="/dashboard/notification">
                    <div className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname.startsWith('/dashboard/notification') ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-500 hover:text-white'}`}>
                        <MdNotifications className='text-xl mr-2' />
                        <h1 className='text-base font-bold'>Notification</h1>
                    </div>
                </Link>
            </div>
            <div className={`fixed ${isScrolled ? 'bottom-0' : 'bottom-0'} mt-auto flex flex-col justify-between w-56 overflow-auto border-r border-gray-300 bg-white transition-all duration-300 ease-in-out`}>
                {/* <Link href="/dashboard/setting" className={`flex items-center w-full h-16 gap-1 px-5 cursor-pointer rounded ${pathname === '/dashboard/setting' ? 'bg-blue-300 text-white' : 'text-black hover:bg-blue-500 hover:text-white'}`}>
                    <MdSettings className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Settings</h1>
                </Link> */}
                <Setting />
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center w-full h-16 gap-1 px-5 cursor-pointer text-gray-500 hover:text-gray-700 font-bold rounded"
                >
                    <FaSignOutAlt className="text-xl mr-2" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}