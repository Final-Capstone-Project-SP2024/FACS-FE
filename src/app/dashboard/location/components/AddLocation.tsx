'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddLocation({ token, onLocationAdded }: { token: string | undefined, onLocationAdded: () => void }) {
  const [locationName, setLocationName] = useState<string>('');
  const [locationImage, setLocationImage] = useState<File | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [locationNameError, setLocationNameError] = useState<string | null>(null);

  const handleAddLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFileError(null);
    setLocationNameError(null);

    if (!locationImage) {
      setFileError('An image file is required.');
      return;
    }
    if (!locationName) {
      setFileError('Location Name is required.');
      return;
    }

    if (!locationName.startsWith("Location")) {
      setLocationNameError("Location name must start with the keyword 'Location'.");
      return;
    }

    const formData = new FormData();
    formData.append('locationName', locationName);
    formData.append('locationImage', locationImage, locationImage.name);

    try {
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success('Location added successfully');
        onLocationAdded();
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error(errorData);
        toast.error(errorData.Message || 'Failed to add location!');
      }
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationName(e.target.value);
  };

  const validateAndSetLocationImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5242880) {
        setFileError('File size should be less than 5MB.');
        setLocationImage(null);
        return;
      }
      
      const validExtensions = ['png', 'jpg', 'jpeg', 'webp'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!validExtensions.includes(fileExtension || '')) {
        setFileError('File type must be .png, .jpg, .jpeg, or .webp.');
        setLocationImage(null);
        return;
      }

      setLocationImage(file);
      setFileError(null);
    } else {
      setFileError('An image file is required.');
      setLocationImage(null);
    }
  };

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
                {locationNameError && <p className="text-red-500 text-xs italic">{locationNameError}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="locationImage" className="block font-medium text-sm text-gray-700">Location Image:</label>
                <input
                  type="file"
                  id="locationImage"
                  onChange={validateAndSetLocationImage}
                  className="w-full border rounded p-2 mt-1"
                  required
                />
                {fileError && <p className="text-red-500 text-xs italic">{fileError}</p>}
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