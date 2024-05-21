'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DisconnectedCamera from './DisconnectedCamera';

type Camera = {
  cameraId: string;
  cameraDestination: string;
  status: string;
  locationId: string;
};

type Location = {
  locationId: string;
  locationName: string;
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
  const [locationId, setLocationId] = useState<string>(camera.locationId || '');
  const [destination, setDestination] = useState<string>(camera.cameraDestination || '');
  const [listLocations, setListLocations] = useState<Location[]>([]);
  const [status, setStatus] = useState(camera.status);

  console.log(locationId) 
  // console.log(camera.locationId, camera.cameraDestination, camera.status);
  const handleGetListLocations = async () => {
    try { 
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data = await response.json();
      console.log(data.data);
      setListLocations(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCamera = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera/${cameraId}`, {
        method: 'PATCH',
        body: JSON.stringify({ destination, locationId, status }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // console.log(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera/${cameraId}`)
      // console.log(JSON.stringify({ destination, locationId, status }))
      if (response.ok) {
        toast.success('Camera updated successfully');
        onUpdate();
        setShowModal(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.Message || 'Failed to update camera');
      }
    } catch (error) {
      console.error('Error updating camera:', error);
    }
  };

  useEffect(() => {
    handleGetListLocations();
  }, []);

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl font-semibold mb-4">Update Camera</h2>
            <form onSubmit={handleUpdateCamera}>
              <div className="mb-4">
                <label htmlFor="cameraDestination" className="block font-medium text-sm text-gray-700">Camera Destination:</label>
                <input
                  type="text"
                  id="cameraDestination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full border rounded p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
              <label htmlFor="locationId" className="block font-medium text-sm text-gray-700">Location:</label>
                <select
                  name="locationId"
                  id="locationId"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full border rounded p-2 mt-1"
                  required
                >
                  <option value="">Select location...</option>
                  {listLocations.map(location => (
                    <option key={location.locationId} value={location.locationId}>
                      {location.locationName}
                    </option>
                  ))}
                </select>
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
  );
}