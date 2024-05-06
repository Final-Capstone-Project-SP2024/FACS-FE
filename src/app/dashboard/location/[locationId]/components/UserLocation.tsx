'use client'
import React, { useEffect, useState } from 'react';
import AddUserToLocation from './AddUserToLocation';
import RemoveStaffFromLocation from './RemoveStaffFromLocation';

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
        <div className='flex flex-col h-full'>
            <div className="flex justify-between items-center mb-4 px-4">
                <h1 className="text-2xl font-bold">Users</h1>
                <div>
                    <AddUserToLocation locationId={locationId} token={token} updateUserLocations={updateUserLocations} />
                </div>
            </div>
            <div className="overflow-x-auto bg-white">
                <table className="min-w-full divide-y divide-gray-200 bg-gray-100 border-b border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-2 py-3 text-center text-xs border">Index</th>
                            <th className="px-6 py-3 text-center text-xs border">Username</th>
                            <th className="px-6 py-3 text-center text-xs border">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y bg-white">
                        {locations.map((location, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border text-center">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border text-center">{location.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border text-center"><RemoveStaffFromLocation staffId={location.userID} locationId={locationId} token={token} updateUserLocations={updateUserLocations}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
