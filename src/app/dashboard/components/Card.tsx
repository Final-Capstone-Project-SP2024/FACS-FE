import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import React from 'react'
import { MdSupervisedUserCircle } from 'react-icons/md';
import { CiCamera } from "react-icons/ci";
import { MdLocationOn } from "react-icons/md";

export default function Card({ input, type, numberAdd }) {
  const typeIconMap = {
    user: <MdSupervisedUserCircle size={24} />,
    camera: <CiCamera size={24} />,
    location: <MdLocationOn size={24} />,
    // Add more mappings for other types as needed
  };
  return (
    <div className='bg-blue-gray-100 p-5 rounded-xl flex gap-5 cursor-pointer    '>
      {typeIconMap[input]}
      <div className='flex flex-col gap-5'>
        <span>{type}</span>
        <span className='font-medium text-base'>{numberAdd}</span>
        <span></span>
      </div>
    </div>
  )

}