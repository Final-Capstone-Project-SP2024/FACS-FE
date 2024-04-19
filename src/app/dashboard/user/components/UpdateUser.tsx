'use client'
import React, { useState, useEffect } from 'react';

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
    onUpdate: Function;
    token: string | undefined;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UpdateUser({ userId, user, onUpdate, token, showModal, setShowModal }: UpdateUserProps) {
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [name, setName] = useState(user.name);
    // const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setEmail(user.email);
        setPhone(user.phone);
        setName(user.name);
    }, [user]);

    const handleUpdateUser = async (e: React.FormEvent) => {
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
                console.log('User updated successfully');
                onUpdate();
                setShowModal(false);
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <>
            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-md">
                        <h2 className="text-lg font-bold mb-4">Update User</h2>
                        <form onSubmit={handleUpdateUser}>
                            <div className="mb-4">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone">Phone:</label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                    className="bg-[#F87171] hover:bg-[#EF4444] text-white font-bold py-2 px-4 rounded"
                                >
                                    Update User
                                </button>
                                
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
