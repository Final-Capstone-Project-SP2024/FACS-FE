'use client'
import React, { useEffect, useState } from 'react'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import UserLocation from './UserLocation';
import Image from 'next/image';

const firebaseConfig = {
    apiKey: "AIzaSyD_kES-S_Kg6loaZmTIQdlTjs9danQqAoM",
    projectId: "final-capstone-project-f8bdd",
    storageBucket: "final-capstone-project-f8bdd.appspot.com",
};

const app = initializeApp(firebaseConfig);

type Camera = {
    cameraId: string;
    cameraName: string;
    cameraDestination: string;
    cameraImage: string;
}
type LocationDetails = {
    locationId: string;
    locationName: string;
    userQuantity: number;
    cameraQuantity: number;
    createdDate: string;
    users: Array<{ userId: string; userName: string; }>;
    cameraInLocations: Camera[];
}

type CameraImages = {
    [cameraId: string]: string;
}

export default function LocationDetails({ locationId, token }: { locationId: string, token: string | undefined }) {
    // const [locationDetails, setLocationDetails] = useState(null);
    // const [cameraImages, setCameraImages] = useState({});
    const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
    const [cameraImages, setCameraImages] = useState<CameraImages>({});
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchLocationDetails = async () => {
            try {
                const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Location/${locationId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch location details');
                }
                const data = await response.json();
                setLocationDetails(data.data);

                const storage = getStorage(app);
                const newCameraImages: CameraImages = {};
                for (const camera of data.data.cameraInLocations) {
                    const cameraRef = ref(storage, `CameraImage/${camera.cameraImage}`);
                    newCameraImages[camera.cameraId] = await getDownloadURL(cameraRef);
                }
                setCameraImages(newCameraImages);
            } catch (error) {
                console.error('Error fetching location details:', error);
            }
        };

        if (locationId && token) {
            fetchLocationDetails();
        }
    }, [locationId, token]);

    if (!locationDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className='bg-gray-100 p-4 min-h-screen'>
            <div className='flex flex-row bg-white'>
                <div className='flex flex-wrap m-2 w-2/3'>
                    {locationDetails?.cameraInLocations.map(camera => (
                        <div key={camera.cameraId} className='p-2 w-full sm:w-1/2 md:w-1/3'>
                            <div className='bg-white rounded-lg shadow overflow-hidden'>
                                {cameraImages[camera.cameraId] && (
                                    <div className="relative w-full h-48"> {/* Adjust height as needed */}
                                        <Image
                                            src={cameraImages[camera.cameraId]}
                                            alt={camera.cameraName}
                                            layout="fill"
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                )}
                                <div className='p-4 text-center'>
                                    <p className='text-lg font-semibold'>{camera.cameraName}</p>
                                    <p className='text-sm'>{camera.cameraDestination}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='w-4 bg-gray-100'></div>
                <div className='bg-white p-4 w-1/3'>
                    <UserLocation locationId={locationId} token={token} />
                </div>
            </div>
        </div>
    )
}
