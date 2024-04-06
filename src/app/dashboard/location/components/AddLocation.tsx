'use client'
import React, { useState } from 'react';

export default function AddLocation({ token }: { token: string | undefined }) {
  const [showModal, setShowModal] = useState(false);
  const [locationName, setLocationName] = useState('');

  const handleAddLocation = async () => {
    try {
      const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location`, {
        method: 'POST',
        body: JSON.stringify({ locationName }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        console.log('Location added successfully');
        setShowModal(false); // Close modal on success
      } else {
        console.error('Failed to add location');
      }
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Add Location</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Location</h2>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter Location Name"
            />
            <button onClick={handleAddLocation}>Submit</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
