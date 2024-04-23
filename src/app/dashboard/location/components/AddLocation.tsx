'use client';
import React, { useState } from 'react';

export default function AddLocation({ token, onLocationAdded }: { token: string | undefined, onLocationAdded: () => void }) {
  const [locationName, setLocationName] = useState<string>('');
  const [locationImage, setLocationImage] = useState<File | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleAddLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('locationName', locationName);
    if (locationImage) {
      formData.append('locationImage', locationImage, locationImage.name);
    }
  
    try {
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log('Location added successfully');
        onLocationAdded();
        setShowModal(false);
      } else {
        throw new Error("Failed to add location");
      }
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationName(e.target.value);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocationImage(file);
    } else {
      setLocationImage(null);
    }
  }

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowModal(true)}
      >
        Add Location
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add Location</h2>
            <form onSubmit={handleAddLocation}>
              <div className="mb-4">
                <label htmlFor="locationName" className="block font-medium text-sm text-gray-700">Location Name:</label>
                <input
                  type="text"
                  id="locationName"
                  value={locationName}
                  onChange={handleNameChange}
                  className="w-full border rounded p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="locationImage" className="block font-medium text-sm text-gray-700">Location Image:</label>
                <input
                  type="file"
                  id="locationImage"
                  onChange={handleFileChange}
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
                  Add Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}