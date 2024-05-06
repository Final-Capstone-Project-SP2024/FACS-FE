'use client'
import React, { useState } from 'react';
import { IoIosRemoveCircle } from "react-icons/io";
import { toast } from 'react-toastify';


export default function RemoveStaffFromLocation({ staffId, locationId, token, updateUserLocations }: { staffId: string, locationId: string, token: string | undefined, updateUserLocations: () => void }) {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRemoveStaff = async () => {
        const staffData = {
            staff: [staffId]
        };
        console.log('here' + staffData);
        try {
            const res = await fetch(
                `https://firealarmcamerasolution.azurewebsites.net/api/v1/Location/${locationId}/unregisterStaff`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(staffData),
                }
            );
            if (res.ok) {
                updateUserLocations();
                toast.success('Staff removed from this location successfully');
            } else {
                const errorData = await res.json();
                toast.error(errorData.Message || 'Failed to remove staff from this location');
            }
        } catch (error) {
            console.error('Error removing staff:', error);
        } finally {
            setShowModal(false);
        }
    };


    return (
        <div>
            <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setShowModal(true)}
                disabled={isLoading}
            >
                <IoIosRemoveCircle className={`font-bold w-5 h-5 inline-block ${isLoading ? 'text-gray-300' : 'text-white'}`} />
            </button>

            {showModal && (
                <div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="bg-white p-8 rounded shadow-md" role="document">
                        <h3 id="modal-title" className="text-lg font-bold mb-4">Do you really want to delete?</h3>
                        {error && (
                            <div className="text-red-500 mb-4">
                                Error: {error}
                            </div>
                        )}
                        <div className="flex justify-end space-x-4">
                            {/* No button */}
                            <button
                                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                No
                            </button>

                            {/* Yes button */}
                            <button
                                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50' : ''}`}
                                onClick={handleRemoveStaff}
                                disabled={isLoading}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
