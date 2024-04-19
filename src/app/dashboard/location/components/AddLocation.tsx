'use client';
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
                    Authorization: `Bearer ${token}`,
                },
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
            <button
                className="bg-[#F87171] hover:bg-[#EF4444] text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(true)}
            >
                Add Location
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Add New Location</h2>
                        <input
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="Enter Location Name"
                            className="w-full border rounded p-2 mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 mr-4 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-[#F87171] hover:bg-[#EF4444] text-white font-bold py-2 px-4 rounded"
                                onClick={handleAddLocation}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
