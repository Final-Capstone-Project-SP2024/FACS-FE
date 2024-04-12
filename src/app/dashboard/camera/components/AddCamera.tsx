'use client'
import { getCamera } from '@/app/lib';
import React, { useState, useEffect } from 'react';

type Location = {
  locationId: string;
  locationName: string;
};

export default function AddCamera({ token }: { token: string | undefined}) {
  const [status, setStatus] = useState<string>('Active'); // Default
  const [destination, setDestination] = useState<string>('');
  const [locationId, setLocationId] = useState<string>('');
  const [listLocations, setListLocations] = useState<Location[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

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
      setListLocations(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCameraToLocation = async () => {
    try {
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          status,
          destination,
          locationId,
        }),
      });
      if (response.ok) {
        console.log('Camera added successfully');
        setShowModal(false);
      }
      if (!response.ok) {
        throw new Error("Failed to add camera");
      }
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch list of locations when component mounts
    handleGetListLocations();
  }, []);

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowModal(true)}
      >
        Add Camera
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add Camera</h2>
            <form onSubmit={handleAddCameraToLocation}>
              <div className="mb-4">
                <label htmlFor="status" className="block font-medium text-sm text-gray-700">Status:</label>
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded p-2 mt-1"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="destination" className="block font-medium text-sm text-gray-700">Destination:</label>
                <input
                  type="text"
                  id="destination"
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
                  Add Camera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
