'use client';
import React, { useState, useEffect } from 'react';
import AddCamera from './AddCamera';
import UpdateCamera from './UpdateCamera';
import FixCamera from './FixCamera';
import DisconnectedCamera from './DisconnectedCamera';
import Switch from 'react-switch';
import { toast } from 'react-toastify';

type Camera = {
    id: string;
    cameraName: string;
    cameraDestination: string;
    status: string;
};

type Location = {
    locationId: string;
    locationName: string;
};

const GetCamera = ({ token }: { token: string | undefined }) => {
    const [cameras, setCameras] = useState<any[]>([]);
    const [filteredCameras, setFilteredCameras] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedCamera, setSelectedCamera] = useState<any | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);

    const [filters, setFilters] = useState({
        name: '',
        status: ''
    });

    const handleDisconnectCamera = async (cameraId : string) => {
        try {
            const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera/${cameraId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Camera disconnected successfully');
                refreshCameras();
            } else {
                toast.error('Failed to disconnect camera');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while trying to disconnect the camera');
        }
    };

    const handleFixCamera = async (cameraId : string) => {
        try {
            const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera/${cameraId}/active`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Camera fixed successfully');
                refreshCameras();
            } else {
                const errorData = await response.json();
                toast.error(errorData.Message || 'Failed to fix camera');
            }
        } catch (error) {
            console.error('Error fixing camera:', error);
            toast.error('Error fixing camera');
        }
    };

    const handleRowClick = (camera: any) => {
        const location = locations.find(loc => loc.locationName === camera.locationName);
        const cameraWithLocationId = {
            ...camera,
            locationId: location ? location.locationId : '',
        };
        setSelectedCamera(cameraWithLocationId);
        setShowModal(true);
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch('https://firealarmcamerasolution.azurewebsites.net/api/v1/Location', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const apiResponse = await response.json();
                setLocations(apiResponse.data);
            } else {
                throw new Error('Failed to fetch locations');
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [token]);

    const refreshCamerasAfterFix = () => {
        refreshCameras();
    };
    const refreshCameras = async () => {
        setLoading(true);
        setError(null);
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
                apiResponse.data.sort((a: Camera, b: Camera) => a.cameraName.localeCompare(b.cameraName));
                setCameras(apiResponse.data);
                setFilteredCameras(apiResponse.data);
                setTotalPages(Math.ceil(apiResponse.data.length / itemsPerPage));
            } else {
                throw new Error('Failed to fetch cameras');
            }
        } catch (error) {
            console.error('Error fetching cameras:', error);
            setError('Error fetching cameras');
        } finally {
            setLoading(false);
        }
    };

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
                    //sort cameras by name
                    apiResponse.data.sort((a: Camera, b: Camera) => a.cameraName.localeCompare(b.cameraName));
                    setCameras(apiResponse.data);
                    setFilteredCameras(apiResponse.data);
                    setTotalPages(Math.ceil(apiResponse.data.length / itemsPerPage));
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
    }, [token, currentPage, itemsPerPage]);

    const [showModal, setShowModal] = useState(false);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCameras.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        refreshCameras();
    }, [token]);

    const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(filters => ({ ...filters, name: e.target.value }));
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(filters => ({ ...filters, status: e.target.value }));
    };

    useEffect(() => {
        let didFiltersChange = false;
        const applyFilters = () => {
            let tempCameras = cameras;

            if (filters.name) {
                tempCameras = tempCameras.filter(camera => camera.cameraName.toLowerCase().includes(filters.name.toLowerCase()));
                didFiltersChange = true;
            }

            if (filters.status) {
                tempCameras = tempCameras.filter(camera => camera.status === filters.status);
                didFiltersChange = true;
            }

            setFilteredCameras(tempCameras);
            setTotalPages(Math.ceil(tempCameras.length / itemsPerPage));
            if (didFiltersChange) {
                setCurrentPage(1);
            }
        };

        applyFilters();
    }, [filters, cameras, itemsPerPage]);

    const paginationControls = (
        <div className="flex items-center justify-center space-x-4 mt-4">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
                Previous
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
                Next
            </button>
        </div>
    );

    return (
        <div className='bg-gray-100 p-4'>
            <div className="flex justify-between items-end mb-4">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Filter by Camera Name"
                        value={filters.name}
                        onChange={handleNameFilterChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:border-blue-500"
                    />

                    <select
                        value={filters.status}
                        onChange={handleStatusFilterChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Select Status</option>
                        <option value="Connected">Connected</option>
                        <option value="Disconnected">Disconnected</option>
                    </select>
                </div>
                <AddCamera token={token} onCameraAdded={refreshCameras} />
            </div>
            <div className="overflow-x-auto p-3 bg-white">
                <table className="table-auto w-full  border border-gray-300 bg-white">
                    <thead className="bg-gray-100">
                        <tr className="w-full border-gray-300 border-b py-8">
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Index</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Camera Name</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Camera Destination</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Location</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Status</th>
                            <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Action</th>
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
                            currentItems.map((camera, index) => (
                                <tr key={camera.cameraId} className="border-b border-gray-200 hover:bg-gray-50" onClick={() => handleRowClick(camera)}>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{indexOfFirstItem + index + 1}</td>
                                    {/* <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{camera.cameraId}</td> */}
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{camera.cameraName}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{camera.cameraDestination}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{camera.locationName}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left ">
                                        <span className={
                                            `font-bold whitespace-no-wrap inline-block px-2 py-1 rounded ${camera.status === 'Connected'
                                                ? 'border border-green-500 text-green-500 bg-green-50'
                                                : 'border border-red-500 text-red-500 bg-red-100'
                                            }`
                                        }>
                                            {camera.status}
                                        </span>
                                    </td>
                                    <td onClick={(event) => event.stopPropagation()}>
                                        {/* {
                                            camera.status === 'Disconnected' ? (
                                                <FixCamera cameraId={camera.cameraId} token={token} onCameraFixed={refreshCamerasAfterFix} />
                                            ) : (
                                                <DisconnectedCamera token={token} cameraId={camera.cameraId} onCameraAdded={refreshCamerasAfterFix} />
                                            )
                                        } */}
                                        <Switch
                                            onChange={(checked) => {
                                                if (checked) {
                                                    handleFixCamera(camera.cameraId);
                                                } else {
                                                    handleDisconnectCamera(camera.cameraId);
                                                }
                                            }}
                                            checked={camera.status === 'Connected'}
                                            offColor="#ff5f5f"
                                            onColor="#22c55e"
                                            checkedIcon={false}
                                            uncheckedIcon={false}
                                            className="react-switch"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <nav className="flex rounded-md shadow-sm" aria-label="Pagination">
                    {loading && <div className="text-center py-4 text-gray-500">Loading...</div>}
                    {error && <div className="text-center py-4 text-red-500">Error: {error}</div>}
                    {!loading && !error && (
                        <>
                            {paginationControls}
                        </>
                    )}
                </nav>
            </div>
            {selectedCamera && (
                <UpdateCamera
                    key={selectedCamera.cameraId}
                    cameraId={selectedCamera.cameraId}
                    camera={selectedCamera}
                    onUpdate={() => {
                        refreshCameras();
                    }}
                    token={token}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </div>
    );
};

export default GetCamera;