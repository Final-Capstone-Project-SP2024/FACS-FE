'use client'
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import { MdSettings } from 'react-icons/md';
import { toast } from 'react-toastify';

type AlarmConfiguration = {
  actionConfigurationId: number;
  actionConfigurationName: string;
  min: number;
  max: number;
};

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
  const [alarmConfigurations, setAlarmConfigurations] = useState<AlarmConfiguration[]>([]);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [handles, setHandles] = useState<number[]>([]);
  const [activeHandleIndex, setActiveHandleIndex] = useState(-1);

  const fetchAlarmConfiguration = async () => {
    try {
      const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/ActionConfiguration`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data.data);
        setAlarmConfigurations(data.data);

        const maxValues = data.data.slice(0, 4).map((config : AlarmConfiguration) => config.max);

        setHandles(maxValues);
      }
      if (!res.ok) {
        throw new Error('Failed to fetch alarm configuration');
      }
    } catch (error) {
      console.error('Error fetching alarm configuration:', error);
    }
  }

  const updateAlarmConfiguration = async (index: number, value: number) => {
    // const maxRange = alarmConfigurations[index].max;
    // console.log(value)
    const minRange = alarmConfigurations[index].min;
    // const handleValue = handles[index];
    // const actualValue = Math.round(handleValue); 

    // console.log("actualValue " + actualValue)

    const alarmConfigurationToUpdate = {
      id: index + 1,
      min: minRange,
      max: value,
    };

    try {
      const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/ActionConfiguration/${alarmConfigurationToUpdate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alarmConfigurationToUpdate),
      });
      // console.log(alarmConfigurationToUpdate.min, alarmConfigurationToUpdate.max)
      if (res.ok) {
        toast.success('Alarm configuration updated successfully');
        fetchAlarmConfiguration();
      } else {
        const errorData = await res.json();
        toast.error(errorData.Message || 'Failed to update alarm configuration');
      }
    } catch (error) {
      console.error('Error updating alarm configuration:', error);
    }
  }

  useEffect(() => {
    fetchAlarmConfiguration();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleWidth = 0;

  const debouncedUpdateAlarmConfiguration = useCallback(
    debounce(updateAlarmConfiguration, 250),
    [updateAlarmConfiguration]
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
    // console.log(index, newHandles[index])
    debouncedUpdateAlarmConfiguration(index, newHandles[index]);
  }, [handles, debouncedUpdateAlarmConfiguration]);

  const getSegmentColorClass = (index : number) => {
    const colors = ['bg-[#ffe9d2]', 'bg-orange-200', 'bg-orange-300', 'bg-orange-500', 'bg-orange-700'];
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
          <div className='bg-white p-5 rounded-lg shadow-lg w-auto'>
            <h2 className='text-xl font-semibold mb-4'>Alarm Configuration Setting</h2>
            <h2 className='text-lg font-semibold mb-2'>Alarm Configuration Level</h2>

            <div className='flex flex-col items-center justify-center'>
              {/* <div className='flex justify-between w-96'>
                {handles.map((handle, index) => (
                  <div
                    key={index}
                    className="text-xs px-1 py-0.5 bg-black text-white rounded"
                    style={{ position: 'absolute', left: `calc(${handle}% - ${(index + 1) * 2}px)`, transform: 'translateX(-50%)', bottom: '100%' }}
                  >
                    {`lvl${index + 1}`}
                  </div>
                ))}
              </div> */}
              <div className="mb-2 flex items-center justify-center w-full">
                <div id="slider" className="relative w-[500px] h-4 bg-gray-200">
                  {/* <div className="absolute left-0 top-0 w-2 h-4 bg-green-500"></div> */}
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
                  {/* <div className="absolute right-0 top-0 w-2 h-4 bg-red-500"></div> */}
                  {
                    handles.map((handle, index) => (
                      <div
                        key={index}
                        className="absolute top-0 w-4 h-4 border-2 border-white cursor-pointer"
                        style={{
                          left: `calc(${handle}% - ${handleWidth / 2}px)`,
                          backgroundColor: 'transparent'
                        }}
                        onMouseDown={(e) => {
                          setActiveHandleIndex(index);
                          const onMouseMove = (e : React.MouseEvent<HTMLDivElement>) => handleDrag(index, e);
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
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 mb-4">
              {alarmConfigurations.slice(0, 3).map((config, index) => (
                <div key={config.actionConfigurationId} className="flex items-center justify-center">
                  <div className={`w-10 h-4 ${getSegmentColorClass(index)} inline-block border border-gray-200 mr-2`}></div>
                  <p className="text-xs">{config.actionConfigurationName} ({config.min}% - {config.max}%)</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {alarmConfigurations.slice(3).map((config, index) => (
                <div key={config.actionConfigurationId} className="flex items-center justify-center">
                  <div className={`w-10 h-4 ${getSegmentColorClass(index + 3)} inline-block border border-gray-200 mr-2`}></div>
                  <p className="text-xs">{config.actionConfigurationName} ({config.min}% - {config.max}%)</p>
                </div>
              ))}
            </div>

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
