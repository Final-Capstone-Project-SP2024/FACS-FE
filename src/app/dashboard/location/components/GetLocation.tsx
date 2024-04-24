'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import AddLocation from './AddLocation';
import UpdateLocation from './UpdateLocation';

export default function GetLocation({ token }: { token: string | undefined }) {
    const [locations, setLocations] = useState<any[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [filter, setFilter] = useState<string>('');

    const fetchLocations = async () => {
        setLoading(true);
        setError(null);
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
                setLocations(apiResponse.data);
                setFilteredLocations(apiResponse.data); // Initialize filteredLocations
            } else {
                throw new Error('Failed to fetch location');
            }
        } catch (error) {
            setError('Error fetching location');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [token]);

    useEffect(() => {
        // Filter locations based on the filter state
        const filtered = locations.filter(location =>
            location.locationName.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredLocations(filtered);
    }, [filter, locations]);

    const indexOfLastLocation = currentPage * itemsPerPage;
    const indexOfFirstLocation = indexOfLastLocation - itemsPerPage;
    const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    if (loading) return <div>Loading locations...</div>;
    if (error) return <div>Error: {error}</div>;

    const onLocationAdded = () => {
        fetchLocations();
    };

    return (
        <div className='bg-gray-100 p-4'>
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Filter by Location Name"
                        value={filter}
                        onChange={handleFilterChange}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div>
                    <AddLocation token={token} onLocationAdded={onLocationAdded} />
                </div>
            </div>
            <div className="overflow-x-auto p-3 bg-white">
                <table className="table-auto w-full  border border-gray-300 bg-white">
                    <thead className="bg-gray-100">
                        <tr className="w-full border-gray-300 border-b py-8">
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Index</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Location Name</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Number of Cameras</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Number of Security</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLocations.map((location, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{indexOfFirstLocation + index + 1}</td>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">
                                    <Link href={`location/${location.locationId}`} className="text-blue-500 hover:underline">
                                        {location.locationName}
                                    </Link>
                                </td>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{location.numberOfCamera}</td>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{location.numberOfSecurity}</td>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left"><UpdateLocation /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
                <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
}