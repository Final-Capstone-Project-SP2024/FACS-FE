'use client'
import React, { useState } from 'react'
import { toast } from 'react-toastify';

type DisconnectedCameraProps = {
  token: string | undefined;
  cameraId: string;
  onCameraAdded: () => void;
}

export default function DisconnectedCamera({ token, cameraId, onCameraAdded }: DisconnectedCameraProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDisconnectCamera = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsProcessing(true);
    try {
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera/${cameraId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Camera disconnected successfully');
        onCameraAdded();
      } else {
        toast.error('Failed to disconnect camera');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while trying to disconnect the camera');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <button 
      onClick={handleDisconnectCamera} 
      className="FixCameraButton bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      disabled={isProcessing}
    >
      {isProcessing ? 'Disconnecting...' : 'Disconnect'}
    </button>
  )
}