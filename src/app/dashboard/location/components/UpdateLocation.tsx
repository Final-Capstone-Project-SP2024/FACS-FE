'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

type Location = {
  locationId: string;
  locationName: string;
};

type UpdateLocationProps = {
  locationId: string;
  locationName: string;
  location: Location;
  onUpdate: Function;
  token: string | undefined;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UpdateLocation({ locationId, locationName, location, onUpdate, token, showModal, setShowModal }: UpdateLocationProps) {
  const [name, setName] = useState<string>(location.locationName || '');

  const handleUpdateLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location/${locationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ locationName: name }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        toast.success('Location updated successfully');
        onUpdate();
        setShowModal(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.Message || 'Failed to update location');
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl font-semibold mb-4">Update Location</h2>
            <form onSubmit={handleUpdateLocation}>
              <div className="mb-4">
                <label htmlFor="locationName" className="block font-medium text-sm text-gray-700">Location Name:</label>
                <input
                  type="text"
                  id="locationName"
                  value={name}
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
                  Update Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}