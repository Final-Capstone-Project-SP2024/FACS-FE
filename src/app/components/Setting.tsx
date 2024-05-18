'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { toast } from 'react-toastify';

type AlarmConfiguration = {
  alarmNameConfiguration: string;
  end: number;
}
export default function Setting() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alarmConfigurations, setAlarmConfigurations] = useState<AlarmConfiguration[]>([]);
  const [hoverIndex, setHoverIndex] = useState(-1);

  const fetchAlarmConfiguration = async () => {
    try {
      const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/AlarmConfiguration`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        // console.log(data.data);
        setAlarmConfigurations(data.data);
      }
      if (!res.ok) {
        throw new Error('Failed to fetch alarm configuration');
      }
    } catch (error) {
      console.error('Error fetching alarm configuration:', error);
    }
  }

  const updateAlarmConfiguration = async (newEndValue: number) => {
    try {
      const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/AlarmConfiguration?id=1`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: 0,
          end: newEndValue,
        }),
      });
      if (res.ok) {
        toast.success('Alarm configuration updated successfully');
      }
      if (!res.ok) {
        throw new Error('Failed to update alarm configuration');
      }
      await fetchAlarmConfiguration();
    } catch (error) {
      console.error('Error updating alarm configuration:', error);
    }
  };

  useEffect(() => {
    fetchAlarmConfiguration();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSegmentClick = (index: number) => {
    console.log(`Segment ${index} clicked`);
    updateAlarmConfiguration((index + 1) * 10);
  };

  const handleSegmentHover = (index: number) => {
    setHoverIndex(index);
  };

  const handleSegmentLeave = () => {
    setHoverIndex(-1);
  };

  const hexagonStyle = {
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
  };
  const fakeAlarmConfig = alarmConfigurations.find(config => config.alarmNameConfiguration === 'Fake Alarm');
  const fakeAlarmPercentage = fakeAlarmConfig ? fakeAlarmConfig.end : 0;
  const coloredSegments = Math.ceil(fakeAlarmPercentage / 10);

  console.log(coloredSegments, fakeAlarmPercentage, fakeAlarmConfig);

  const segmentClasses = [
    'bg-gray-300',
    'bg-orange-50',
    'bg-orange-100',
    'bg-orange-200',
    'bg-orange-300',
    'bg-orange-400',
    'bg-orange-500',
    'bg-orange-600',
    'bg-orange-700',
    'bg-orange-800',
    'bg-red-900',
  ];

  return (
    <div className="flex flex-col">
      <button
        onClick={toggleModal}
        className="flex items-center gap-1 px-5 cursor-pointer text-gray-500 hover:text-gray-700 font-bold rounded"
      >
        <MdSettings className="text-xl mr-2" />
        <span>Settings</span>
      </button>
      {isModalOpen && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50'>
          <div className='bg-white p-5 rounded-lg shadow-lg w-auto'>
            <h2 className='text-xl font-semibold mb-4'>Alarm Configuration Setting</h2>
            <h2 className='text-lg font-semibold mb-2'>Alarm Notify Level</h2>
            <p className="text-sm text-gray-600 mb-2">
              Click a segment to set the alarm threshold (10% increments).
            </p>
            <div className="mb-2 flex">
              {new Array(10).fill(null).map((_, index) => {
                const isColored = index < coloredSegments || index <= hoverIndex;
                const segmentClass = isColored ? segmentClasses[index + 1] : segmentClasses[0];

                return (
                  <div
                    key={index}
                    onMouseEnter={() => handleSegmentHover(index)}
                    onMouseLeave={handleSegmentLeave}
                    className={`mb-2 h-6 w-14 flex justify-center items-center cursor-pointer ${segmentClass} transition-colors duration-150 ease-in-out`}
                    onClick={() => handleSegmentClick(index)}
                    style={hexagonStyle}
                  ></div>
                );
              })}
            </div>
            <div className='mt-4 flex justify-end'>
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