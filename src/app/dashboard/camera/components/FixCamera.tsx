'use client'
import React from 'react';
import { toast } from 'react-toastify';

type FixCameraProps = {
    token: string | undefined;
    cameraId: string;
    onCameraFixed: () => void;
  }
  
  const FixCamera = ({ token, cameraId, onCameraFixed } : FixCameraProps) => {
    console.log(token, cameraId, onCameraFixed);
    const handleFixCamera = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
  
      try {
        const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera/${cameraId}/active`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          toast.success('Camera fixed successfully');
          onCameraFixed();
        } else {
          const errorData = await response.json();
          toast.error(errorData.Message || 'Failed to fix camera');
        }
      } catch (error) {
        console.error('Error fixing camera:', error);
        toast.error('Error fixing camera');
      }
    };
  
    return (
      <button onClick={handleFixCamera} className="FixCameraButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Fix Camera
      </button>
    );
  };
  
  export default FixCamera;