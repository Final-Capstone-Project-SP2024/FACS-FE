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
      setListLocations(data);
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
        // const updatedCameraList = await getCamera(token);
        // console.log(updatedCameraList);
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
      <button onClick={() => setShowModal(true)}>Add Camera</button>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add Camera</h3>
                    <div className="mt-2">
                      <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          name="status"
                          id="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="mt-1 p-2 w-full border-gray-300 rounded-md"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                          Destination
                        </label>
                        <input
                          type="text"
                          name="destination"
                          id="destination"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="mt-1 p-2 w-full border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <select
                          name="locationId"
                          id="locationId"
                          value={locationId}
                          onChange={(e) => setLocationId(e.target.value)}
                          className="mt-1 p-2 w-full border-gray-300 rounded-md"
                        >
                          <option value="">Select location...</option>
                          {listLocations?.data.map((location) => (
                            <option key={location.locationId} value={location.locationId}>{location.locationName}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleAddCameraToLocation}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Camera
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
