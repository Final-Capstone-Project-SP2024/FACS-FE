'use client'
import React, { useEffect, useState } from 'react';

const handleGetUserLocation = async (locationId: string, token: string | undefined) => {
    const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location/${locationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (res.ok) {
        const apiResponse = await res.json();
        console.log('Location fetched successfully');
        console.log(apiResponse);
        console.log(apiResponse.data);
        return apiResponse.data;
    } else {
        console.error('Failed to fetch location');
        return [];
    }
};

export default function UserLocation({ locationId, token }: { locationId: string; token: string | undefined }) {
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError(null);
        handleGetUserLocation(locationId, token)
            .then((data) => {
                setLocations(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [locationId, token]);

    if (loading) return <div>Loading user locations...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>User Locations</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium">Index</th>
                        <th className="px-6 py-3 text-left text-xs font-medium">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium">User Name</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {locations.map((location, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.userID}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}