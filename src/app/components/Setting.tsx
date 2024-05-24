'use client';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import { MdSettings } from 'react-icons/md';
import { toast } from 'react-toastify';
import { FaBell } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";

type ActionConfiguration = {
  actionConfigurationId: number;
  actionConfigurationName: string;
  min: number;
  max: number;
};

type AlarmConfiguration = {
  alarmNameConfiguration: string;
  end: number;
}

type DebounceFunction = (...args: any[]) => void;

const debounce = (func: DebounceFunction, wait: number): DebounceFunction => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Setting() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ActionConfigurations, setActionConfigurations] = useState<ActionConfiguration[]>([]);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [handles, setHandles] = useState<number[]>([]);
  const [activeHandleIndex, setActiveHandleIndex] = useState(-1);
  const [alarmConfigurations, setAlarmConfigurations] = useState<AlarmConfiguration[]>([]);
  const [activeTab, setActiveTab] = useState('action');

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
      const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/AlarmConfiguration/1`, {
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
        const errorMessage = await res.json();
        toast.error(errorMessage.message || 'Failed to update alarm configuration');
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

  const handleSegmentClick = (index: number) => {
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

  const fetchActionConfiguration = async () => {
    try {
      const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/ActionConfiguration`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setActionConfigurations(data.data);

        const maxValues = data.data.slice(0, 4).map((config: ActionConfiguration) => config.max);

        setHandles(maxValues);
      }
      if (!res.ok) {
        throw new Error('Failed to fetch alarm configuration');
      }
    } catch (error) {
      console.error('Error fetching alarm configuration:', error);
    }
  }

  const updateActionConfiguration = async (index: number, value: number) => {
    const minRange = ActionConfigurations[index].min;

    const ActionConfigurationToUpdate = {
      id: index + 1,
      min: minRange,
      max: value,
    };

    try {
      const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/ActionConfiguration/${ActionConfigurationToUpdate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ActionConfigurationToUpdate),
      });
      if (res.ok) {
        toast.success('Alarm configuration updated successfully');
        fetchActionConfiguration();
      } else {
        const errorData = await res.json();
        toast.error(errorData.Message || 'Failed to update alarm configuration');
      }
    } catch (error) {
      console.error('Error updating alarm configuration:', error);
    }
  }

  useEffect(() => {
    fetchActionConfiguration();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleWidth = 0;

  const debouncedUpdateActionConfiguration = useCallback(
    debounce(updateActionConfiguration, 250),
    [updateActionConfiguration]
  );

  const handleDrag = useCallback((index: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const slider = document.getElementById('slider')!;
    const rect = slider.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    let percentage = (offsetX / slider.offsetWidth) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    const handleWidthPercentage = (handleWidth / 2) / slider.offsetWidth * 100;
    if (percentage === 100) {
      percentage -= handleWidthPercentage;
    }

    if (index === 0) {
      const nextHandle = handles[index + 1] - handleWidthPercentage;
      if (percentage > nextHandle) {
        percentage = nextHandle;
      }
    }

    else if (index === handles.length - 1) {
      const prevHandle = handles[index - 1] + handleWidthPercentage;
      if (percentage < prevHandle) {
        percentage = prevHandle;
      }
    }

    else {
      const nextHandle = handles[index + 1] - handleWidthPercentage;
      const prevHandle = handles[index - 1] + handleWidthPercentage;
      if (percentage > nextHandle) {
        percentage = nextHandle;
      }
      if (percentage < prevHandle) {
        percentage = prevHandle;
      }
    }

    setActiveHandleIndex(index);
    const newHandles = [...handles];
    newHandles[index] = Math.round(percentage);
    setHandles(newHandles);
    debouncedUpdateActionConfiguration(index, newHandles[index]);
  }, [handles, debouncedUpdateActionConfiguration]);

  const getSegmentColorClass = (index: number) => {
    const colors = ['bg-orange-100', 'bg-orange-300', 'bg-orange-500', 'bg-orange-600', 'bg-orange-900'];
    return colors[index % colors.length];
  };

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
          <div className='bg-white p-5 rounded-lg shadow-lg w-[700px] h-[300px]'>
            <div className='flex mb-4'>
              <h2
                className={`flex flex-1 text-xl font-semibold cursor-pointer px-4 py-2 border-b-2 justify-center items-center ${activeTab === 'action' ? 'text-black bg-white' : 'text-gray-500 bg-gray-200 border-gray-300'}`}
                onClick={() => setActiveTab('action')}
              >
                <span className='mr-2'><FaListUl /></span>Action Configuration
              </h2>
              <h2
                className={`flex flex-1 text-xl font-semibold cursor-pointer px-4 py-2 border-b-2 justify-center items-center ${activeTab === 'alarm' ? 'text-black bg-white' : 'text-gray-500 bg-gray-200 border-gray-300'}`}
                onClick={() => setActiveTab('alarm')}
              >
                <span className='mr-2'><FaBell /></span>Alarm Configuration
              </h2>
            </div>
            {activeTab === 'action' && (
              <>
                <h2 className='text-lg font-semibold mb-2'>Alarm Configuration Level</h2>
                <div className='flex flex-col items-center justify-center mt-6'>
                  <div className="mb-2 flex items-center justify-center w-full">
                    <h2 className='text-lg font-semibold mr-2'>Start</h2>
                    <div id="slider" className="relative w-[500px] h-4 bg-gray-200">
                      {handles.length > 0 && (
                        <div
                          className={`absolute top-0 h-full ${getSegmentColorClass(0)}`}
                          style={{ left: `0%`, width: `${handles[0]}%` }}
                        />
                      )}
                      {handles.slice(0, -1).map((handle, index) => {
                        const width = handles[index + 1] - handle;
                        const colorClass = getSegmentColorClass(index + 1);
                        return (
                          <div
                            key={index}
                            className={`absolute top-0 h-full ${colorClass}`}
                            style={{ left: `${handle}%`, width: `${width}%` }}
                          />
                        );
                      })}
                      <div
                        className={`absolute top-0 h-full ${getSegmentColorClass(handles.length)}`}
                        style={{ right: `0%`, width: `${100 - handles[handles.length - 1]}%` }}
                      />
                      {
                        handles.map((handle, index) => (
                          <div
                            key={index}
                            className={`absolute w-5 h-5 cursor-pointer ${getSegmentColorClass(index + 1)}`}
                            style={{
                              left: `calc(${handle}% - ${handleWidth}px)`,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              padding: '1px',
                            }}
                            onMouseDown={(e) => {
                              setActiveHandleIndex(index);
                              const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => handleDrag(index, e);
                              const onMouseUp = () => {
                                setActiveHandleIndex(-1);
                                document.removeEventListener('mousemove', onMouseMove as unknown as EventListener);
                                document.removeEventListener('mouseup', onMouseUp);
                              };
                              document.addEventListener('mousemove', onMouseMove as unknown as EventListener);
                              document.addEventListener('mouseup', onMouseUp);
                            }}
                          >
                            {activeHandleIndex === index && (
                              <div
                                className="absolute -top-6 text-xs whitespace-nowrap px-1 py-0.5 bg-black text-white rounded"
                                style={{ left: `50%`, transform: 'translateX(-50%)' }}
                              >
                                {`${handle.toFixed(0)}%`}
                              </div>
                            )}
                            <div
                              className="w-full h-full bg-transparent border-white"
                              style={{
                                borderWidth: '2px', // Adjust the white border thickness here
                              }}
                            >
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <h2 className='text-lg font-medium ml-2'>End</h2>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 mb-4">
                  {ActionConfigurations.slice(0, 3).map((config, index) => (
                    <div key={config.actionConfigurationId} className="flex items-center justify-center">
                      <div className={`w-10 h-4 ${getSegmentColorClass(index)} inline-block border border-gray-200 mr-2`}></div>
                      <p className="text-xs">{config.actionConfigurationName} ({config.min}% - {config.max}%)</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {ActionConfigurations.slice(3).map((config, index) => (
                    <div key={config.actionConfigurationId} className="flex items-center justify-center">
                      <div className={`w-10 h-4 ${getSegmentColorClass(index + 3)} inline-block border border-gray-200 mr-2`}></div>
                      <p className="text-xs">{config.actionConfigurationName} ({config.min}% - {config.max}%)</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === 'alarm' && (
              <>
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
              </>
            )}
            <div className='mt-4 flex justify-end'>
              <button onClick={toggleModal} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

