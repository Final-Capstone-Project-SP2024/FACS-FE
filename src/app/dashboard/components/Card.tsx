import React from 'react'
import { MdSupervisedUserCircle, MdWorkHistory, MdLocationOn } from 'react-icons/md';
import { CiCamera } from "react-icons/ci";

type CardInputType = 'user' | 'camera' | 'location' | 'record';

export default function Card({ input, type, numberAdd }: { input: CardInputType, type: string, numberAdd: string }) {
    const typeIconMap: Record<CardInputType, JSX.Element> = {
        user: <MdSupervisedUserCircle size={35} className="text-blue-500" />,
        camera: <CiCamera size={35} className="text-green-500" />,
        location: <MdLocationOn size={35} className="text-red-500" />,
        record: <MdWorkHistory size={35} className="text-yellow-700" />,
    };

    return (
        <div className='bg-white p-4 mb-4 rounded-lg flex items-center space-x-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
            {typeIconMap[input]}
            <div className='flex flex-col'>
                <span className='text-gray-600 text-xs'>{type}</span>
                <span className='text-xl font-bold'>{numberAdd}</span>
            </div>
        </div>
    );
}