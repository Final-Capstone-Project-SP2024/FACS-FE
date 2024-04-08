'use client'
import React, { useState, useEffect } from 'react';

export default function AddUserToLocation({ locationId, token, updateUserLocations }: { locationId: string, token: string | undefined, updateUserLocations: () => void }) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleAddUserToLocation = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location/${locationId}/addstaff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ staff: selectedUsers })
            });
            if (res.ok) {
                console.log('Users added to location successfully');
                // Clear selected users after adding
                setSelectedUsers([]);
                // Close modal
                setShowModal(false);
                // Update user locations
                updateUserLocations();
            } else {
                console.error('Failed to add users to location');
            }
        } catch (error) {
            console.error('Error adding users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/unregistered`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const apiResponse = await response.json();
                console.log('Users fetched successfully');
                console.log(apiResponse.data);
                if (Array.isArray(apiResponse.data)) {
                    setUsers(apiResponse.data);
                } else {
                    console.error('Invalid users data: Expected array');
                }
            } else {
                console.error('Failed to fetch users:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []); // Ensure it runs only once on mount

    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setSelectedUsers(selectedOptions);
    }

    const handleAddButtonClick = () => {
        setShowModal(true);
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    return (
        <div>
            <button onClick={handleAddButtonClick} disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add User
            </button>
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                            <div className="flex justify-between p-4 border-b">
                                <h2 className="text-lg font-semibold">Add User to Location</h2>
                                <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700">
                                    <span className="sr-only">Close</span>
                                    &times;
                                </button>
                            </div>
                            <div className="p-4">
                                <select multiple value={selectedUsers} onChange={handleUserChange} className="w-full border rounded px-3 py-2">
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                                <button onClick={handleAddUserToLocation} disabled={selectedUsers.length === 0 || loading} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add Users
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
