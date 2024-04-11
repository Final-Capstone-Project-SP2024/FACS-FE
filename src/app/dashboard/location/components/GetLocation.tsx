'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function GetLocation({ token }: { token: string | undefined }) {
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch('https://firealarmcamerasolution.azurewebsites.net/api/v1/Location', {
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
                    setLocations(apiResponse.data);
                } else {
                    console.error('Failed to fetch location');
                    setError('Failed to fetch location');
                }
            } catch (error) {
                console.error('Error fetching location:', error);
                setError('Error fetching location');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [token]);

    if (loading) return <tr><td>Loading locations...</td></tr>;
    if (error) return <tr><td>Error: {error}</td></tr>;

    return (
        <>
            {locations.map((location, index) => (
                <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-2">
                        <Link href={`location/${location.locationId}`} className="text-blue-500 hover:underline">{location.locationName}</Link>
                    </td>
                    <td className="px-4 py-2">
                        {location.numberOfCamera}
                    </td>
                    <td className="px-4 py-2">
                        {location.numberOfSecurity}
                    </td>
                </tr>
            ))}
        </>
    );
}
