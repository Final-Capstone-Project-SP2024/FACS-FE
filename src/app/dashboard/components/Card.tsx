import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import React from 'react'
import { MdSupervisedUserCircle } from 'react-icons/md';
import { CiCamera } from "react-icons/ci";
import { MdLocationOn } from "react-icons/md";

type CardInputType = 'user' | 'camera' | 'location';

export default function Card({ input, type, numberAdd }: { input: CardInputType, type: string, numberAdd: string }) {
    const typeIconMap: Record<CardInputType, JSX.Element> = {
        user: <MdSupervisedUserCircle size={24} />,
        camera: <CiCamera size={24} />,
        location: <MdLocationOn size={24} />,
    };

    return (
        <div className='bg-white p-4 my-4 rounded-lg flex items-center space-x-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
            {typeIconMap[input]}
            <div className='flex flex-col'>
                <span className='text-gray-600 text-sm'>{type}</span>
                <span className='text-lg font-semibold'>{numberAdd}</span>
            </div>
        </div>
    );
}