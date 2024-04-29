'use client'
import React, { useState, useEffect } from 'react';

type Camera = {
  id: string;
  name: string;
  destination: string;
  status: string;
};

type UpdateCameraProps = {
  cameraId: string;
  camera: Camera;
  onUpdate: Function;
  token: string | undefined;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UpdateCamera({ cameraId, camera, onUpdate, token, showModal, setShowModal }: UpdateCameraProps) {
  const [name, setName] = useState(camera.name);
  const [destination, setDestination] = useState(camera.destination);

  useEffect(() => {
    setName(camera.name);
    setDestination(camera.destination);
  }, [camera]);

  const handleUpdateCamera = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera/${cameraId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log('Camera updated successfully');
        onUpdate();
        setShowModal(false);
      } else {
        throw new Error("Failed to update location");
      }
    } catch (error) {
      console.error('Error updating camera:', error);
      console.log(cameraId);
    }
  };

  return (
    <div>
      <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowModal(true)}
      >
        Update Camera
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl font-semibold mb-4">Update Camera</h2>
            <form onSubmit={handleUpdateCamera}>
              <div className="mb-4">
                <label htmlFor="cameraName" className="block font-medium text-sm text-gray-700">Camera Name:</label>
                <input
                  type="text"
                  id="cameraName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cameraDestination" className="block font-medium text-sm text-gray-700">Camera Destination:</label>
                <input
                  type="text"
                  id="cameraDestination"
                  value={destination}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded p-2 mt-1"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 mr-4 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update Camera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
