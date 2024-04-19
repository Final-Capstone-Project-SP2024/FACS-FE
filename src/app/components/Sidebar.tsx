import Link from 'next/link';
import React from 'react';
import { AiOutlineAppstore } from 'react-icons/ai';
import { FaCamera, FaRegUser } from 'react-icons/fa';
import { MdLocationCity, MdWorkHistory } from 'react-icons/md';

export default function Sidebar() {
    return (
        <div className="flex flex-col w-56 overflow-auto border-r border-gray-300">
            <Link href="/dashboard">
                <div className="flex items-center w-full h-16 gap-1 px-5 hover:bg-gray-200 active:bg-gray-400 focus:bg-gray-400 cursor-pointer">
                    <AiOutlineAppstore className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Overview</h1>
                </div>
            </Link>
            <Link href="/dashboard/user">
                <div className="flex items-center w-full h-16 gap-1 px-5 rounded hover:bg-gray-200 active:bg-gray-400 focus:bg-gray-400 cursor-pointer">
                    <FaRegUser className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Users</h1>
                </div>
            </Link>
            <Link href="/dashboard/camera">
                <div className="flex items-center w-full h-16 gap-1 px-5 rounded hover:bg-gray-200 active:bg-gray-400 focus:bg-gray-400 cursor-pointer">
                    <FaCamera className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Camera</h1>
                </div>
            </Link>
            <Link href="/dashboard/location">
                <div className="flex items-center w-full h-16 gap-1 px-5 rounded hover:bg-gray-200 active:bg-gray-400 focus:bg-gray-400 cursor-pointer">
                    <MdLocationCity className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Location</h1>
                </div>
            </Link>
            <Link href="/dashboard/record">
                <div className="flex items-center w-full h-16 gap-1 px-5 rounded hover:bg-gray-200 active:bg-gray-400 focus:bg-gray-400 cursor-pointer">
                    <MdWorkHistory className='text-xl mr-2' />
                    <h1 className='text-base font-bold'>Record</h1>
                </div>
            </Link>
        </div>
    )
}