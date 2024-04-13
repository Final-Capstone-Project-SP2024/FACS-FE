'use client'
import React, { useEffect, useState } from 'react';
import AddUserToLocation from './AddUserToLocation';

const handleGetUserLocation = async (locationId: string, token: string | undefined) => {
    const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location/${locationId}/getUser`, {
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
        throw new Error('Failed to fetch location');
    }
};

export default function UserLocation({ locationId, token }: { locationId: string; token: string | undefined }) {
    const [locations, setLocations] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserLocations = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await handleGetUserLocation(locationId, token);
            setLocations(data);
        } catch (error) {
            const errorMessage = (error as Error).message;
            setError(errorMessage || 'Failed to fetch user locations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserLocations();
    }, [locationId, token]);

    const updateUserLocations = () => {
        fetchUserLocations();
    };

    if (loading) return <div>Loading user locations...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold my-4">User Locations</h1>
            <AddUserToLocation locationId={locationId} token={token} updateUserLocations={updateUserLocations} />
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium">Index</th>
                        <th className="px-6 py-3 text-left text-xs font-medium">User Name</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {locations.map((location, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
