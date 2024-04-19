'use client'
import React, { useState, useEffect } from 'react';
import AddCamera from './AddCamera';

type Camera = {
    id: string;
    cameraName: string;
    cameraDestination: string;
    status: string;
};

const GetCamera = ({ token }: { token: string | undefined }) => {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCameras = async () => {
            try {
                const response = await fetch('https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const apiResponse = await response.json();
                    console.log('Camera fetched successfully');
                    console.log(apiResponse);
                    setCameras(apiResponse.data);
                } else {
                    console.error('Failed to fetch cameras');
                    setError('Failed to fetch cameras');
                }
            } catch (error) {
                console.error('Error fetching cameras:', error);
                setError('Error fetching cameras');
            } finally {
                setLoading(false);
            }
        };

        fetchCameras();
    }, [token]);

    return (
        <div className='bg-gray-100 p-4'>
            <AddCamera token={token} />
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full h-16 border-gray-300 border-b py-8">
                            <th className="border px-4 py-2 text-gray-800 font-bold text-center">Index</th>
                            <th className="border px-4 py-2 text-gray-800 font-bold text-center">Camera Name</th>
                            <th className="border px-4 py-2 text-gray-800 font-bold text-center">Camera Destination</th>
                            <th className="border px-4 py-2 text-gray-800 font-bold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4">Loading cameras...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={4} className="text-center text-red-500 py-4">Error: {error}</td>
                            </tr>
                        ) : (
                            cameras.map((camera, index) => (
                                <tr key={camera.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                                    <td className="px-4 py-2 border text-center">{camera.cameraName}</td>
                                    <td className="px-4 py-2 border text-center">{camera.cameraDestination}</td>
                                    <td className="px-4 py-2 border text-center">{camera.status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GetCamera;