'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import AddLocation from './AddLocation';
import UpdateLocation from './UpdateLocation';
import { toast } from 'react-toastify';
import Switch from 'react-switch';

type Location = {
    locationId: string;
    locationName: string;
    isDeleted: boolean;
};

export default function GetLocation({ token }: { token: string | undefined }) {
    const [locations, setLocations] = useState<any[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [filter, setFilter] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showModal, setShowModal] = useState(false);

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
                const sortedLocations = apiResponse.data.sort((a: any, b: any) => {
                    return a.locationName.localeCompare(b.locationName);
                });
                setLocations(sortedLocations);
                setFilteredLocations(sortedLocations);
            } else {
                throw new Error('Failed to fetch locations');
            }
        } catch (error) {
            setError('Error fetching locations');
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

    const handleRowClick = (location: Location) => {
        setSelectedLocation(location);
        setShowModal(true);
    };

    const handleEnableLocation = async (locationId: string) => {
        console.log('Enabling location:', locationId);
        try {
            const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location/${locationId}/active`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);


            if (response.ok) {
                toast.success('Location enabled successfully');
                fetchLocations();
            } else {
                const errorData = await response.json();
                toast.error(errorData.Message || 'Failed to enable location');
                // toast.error('Failed to enable location');
            }
        } catch (error) {
            console.error('Error enabling location:', error);
            toast.error('An error occurred while trying to enable the location');
        }
    };

    const handleDisableLocation = async (locationId: string) => {
        console.log('Disabling location:', locationId);
        try {
            const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location/${locationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);

            if (response.ok) {
                toast.success('Location disabled successfully');
                fetchLocations();
            } else {
                toast.error('Failed to disable location');
            }
        } catch (error) {
            console.error('Error disabling location:', error);
            toast.error('An error occurred while trying to disable the location');
        }
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
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Action</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLocations.map((location, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50" onClick={() => handleRowClick(location)}>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{indexOfFirstLocation + index + 1}</td>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{location.locationName}</td>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{location.numberOfCamera}</td>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{location.numberOfSecurity}</td>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left" onClick={(event) => event.stopPropagation()}>
                                    <Switch
                                        onChange={(checked) => {
                                            if (checked) {
                                                handleEnableLocation(location.locationId);
                                            } else {
                                                handleDisableLocation(location.locationId);
                                            }
                                        }}
                                        checked={!location.isDeleted}
                                        offColor="#ff5f5f"
                                        onColor="#22c55e"
                                        checkedIcon={false}
                                        uncheckedIcon={false}
                                        className="react-switch"
                                    />
                                </td>
                                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">
                                    {location.isDeleted ? null : 
                                    <Link href={`location/${location.locationId}`} className="text-blue-500 hover:underline" onClick={(e) => e.stopPropagation()}>
                                        Details
                                    </Link>}
                                </td>
                                
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
            {selectedLocation && (
                <UpdateLocation
                    key={selectedLocation.locationId}
                    locationId={selectedLocation.locationId}
                    locationName={selectedLocation.locationName}
                    location={selectedLocation}
                    onUpdate={() => {
                        fetchLocations();
                    }}
                    token={token}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </div>
    );
}