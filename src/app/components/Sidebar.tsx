import Link from 'next/link'
import React from 'react'
import { AiOutlineAppstore } from 'react-icons/ai'
import { FaCamera, FaRegUser } from 'react-icons/fa'
import { MdLocationCity, MdWorkHistory } from 'react-icons/md'

export default function Sidebar() {
    return (
        <div className="flex flex-col items-center w-36 pb-4 overflow-auto border-r border-gray-300">
            <Link className="flex items-center justify-center flex-shrink-0 w-full h-16 gap-1 bg-gray-300" href="./">
                <AiOutlineAppstore className='font-bold' />
                <h1 className='text-sm font-bold'>Overview</h1>
            </Link>
            <Link className="flex items-center justify-center flex-shrink-0 w-full h-16 gap-1 rounded hover:bg-gray-300" href="/dashboard/user">
                <FaRegUser className='font-bold' />
                <h1 className='text-sm font-bold'>Users</h1>
            </Link>
            <Link className="flex items-center justify-center flex-shrink-0 w-full h-16 gap-1 rounded hover:bg-gray-300" href="/dashboard/camera">
                <FaCamera />
                <h1 className='text-sm font-bold'>Camera</h1>
            </Link>
            <Link className="flex items-center justify-center flex-shrink-0 w-full h-16 gap-1 rounded hover:bg-gray-300" href="/dashboard/location">
                <MdLocationCity />
                <h1 className='text-sm font-bold'>Location</h1>
            </Link>
            <Link className="flex items-center justify-center flex-shrink-0 w-full h-16 gap-1 rounded hover:bg-gray-300" href="/dashboard/record">
                <MdWorkHistory />
                <h1 className='text-sm font-bold'>Record</h1>
            </Link>
        </div>
    )
}
