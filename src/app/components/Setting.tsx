'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { MdSettings } from 'react-icons/md';

export default function Setting() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState('Change');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChangeButtonClick = () => {
    if (buttonText === 'Change') {
      setButtonText('Update');
    } else {
      console.log('Min:', minValue, 'Max:', maxValue);
      // After handling the update, you might want to close the modal or reset the button text
      // setIsModalOpen(false);
      setButtonText('Change');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <MdSettings className='text-xl mr-2 cursor-pointer hover:text-gray-600' onClick={toggleModal} />
      <h1 className='text-base font-bold'>Settings</h1>
      {isModalOpen && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50'>
          <div className='bg-white p-5 rounded-lg shadow-lg w-96'>
            <h2 className='text-lg font-semibold mb-4'>Alarm Configuration Setting</h2>
            <div className='flex justify-between items-center mb-4 space-x-4'> {/* Add space between Min and Max */}
              <div>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Min
                  <input type="number" value={minValue} onChange={(e) => setMinValue(e.target.value)} disabled={buttonText !== 'Update'} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${buttonText !== 'Update' ? 'bg-gray-200' : ''}`} />
                </label>
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Max
                  <input type="number" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} disabled={buttonText !== 'Update'} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${buttonText !== 'Update' ? 'bg-gray-200' : ''}`} />
                </label>
              </div>
            </div>
            <div className='flex items-center justify-between mt-4'> {/* Add space between fields and buttons */}
              <button onClick={handleChangeButtonClick} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                {buttonText}
              </button>
              <button onClick={toggleModal} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}