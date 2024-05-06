'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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
                // console.log('Users added to location successfully');
                toast.success('Add user to this location successfully!');
                setSelectedUsers([]);
                setShowModal(false);
                updateUserLocations();
            } else {
                const errorData = await res.json();
                toast.error(errorData.Message || 'Failed to add user to this location');
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
            const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/User/unregistered`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const apiResponse = await response.json();
                // toast.success('Add user to this location successfully!');
                // console.log('Users fetched successfully');
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
    }, []);

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
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Add Users to Location</h2>
                        <div className="mb-4">
                            <label htmlFor="users" className="block font-medium text-sm text-gray-700">Select Users:</label>
                            <select
                                multiple
                                id="users"
                                value={selectedUsers}
                                onChange={handleUserChange}
                                className="w-full border rounded p-2 mt-1"
                            >
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 mr-4 rounded"
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddUserToLocation}
                                disabled={selectedUsers.length === 0 || loading}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add Users
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
