'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddUser({ token, onUserAdded }: { token: string | undefined, onUserAdded: () => void }) {
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ name?: string; password?: string; phone?: string }>({});

    const handleValidation = () => {
        let tempErrors = {};
        let isValid = true;

        if (!name.trim() || name.length >= 100) {
            tempErrors = { ...tempErrors, name: 'Name must be less than 100 characters and not just whitespace.' };
            isValid = false;
        }

        if (!phone.match(/^\d{10,11}$/)) {
            tempErrors = { ...tempErrors, phone: 'Phone must be 10 or 11 digits.' };
            isValid = false;
        }

        if (password.length <= 8) {
            tempErrors = { ...tempErrors, password: 'Password must be more than 8 characters.' };
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    }

    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!handleValidation()) {
            return;
        }

        try {
            const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/User`, {
                method: 'POST',
                body: JSON.stringify({ email, phone, name, password }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('User added successfully');
                onUserAdded();
                setShowModal(false);
            } else {
                const errorData = await response.json();
                toast.error(errorData.Message || 'Failed to add user!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(true)}
            >
                Add User
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Add User</h2>
                        <form onSubmit={handleAddUser}>
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
                                {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
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
                                {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block font-medium text-sm text-gray-700">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
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
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}