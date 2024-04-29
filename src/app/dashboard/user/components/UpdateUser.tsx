'use client'
import React, { useState, useEffect } from 'react';
import InactiveUser from './InactiveUser';
import { toast } from 'react-toastify';
import ActiveUser from './ActiveUser';

type User = {
    id: string;
    securityCode: string;
    email: string;
    name: string;
    phone: string;
    role: {
        roleName: string;
    };
    status: string;
    locationName: string;
    token: string | undefined;
};

type UpdateUserProps = {
    userId: string;
    user: User;
    token: string | undefined;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    onUpdate: () => void;
};

export default function UpdateUser({ userId, user, onUpdate, token, showModal, setShowModal }: UpdateUserProps) {
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [name, setName] = useState(user.name);

    useEffect(() => {
        setEmail(user.email);
        setPhone(user.phone);
        setName(user.name);
    }, [user]);

    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/User/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({ email, phone, name }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                toast.success('User updated successfully');
                onUpdate();
                setShowModal(false);
            } else {
                const errorData = await res.json();
                toast.error(errorData.Message || 'Failed to update camera');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Update User</h2>
                        <form onSubmit={handleUpdateUser}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block font-medium text-sm text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block font-medium text-sm text-gray-700">Phone:</label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block font-medium text-sm text-gray-700">Name:</label>
                                <input
                                    type="text"
                                    id="name"
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
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-4 rounded"
                                >
                                    Update User
                                </button>
                                {/* <InactiveUser token={token} userId={user.id} onUserUpdated={onUpdate} /> */}
                                {user.status === 'Inactive' && (
                                    <ActiveUser token={token} userId={user.id} onUserUpdated={onUpdate} />
                                )}

                                {user.status === 'Active' && (
                                    <InactiveUser token={token} userId={user.id} onUserUpdated={onUpdate} />
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}