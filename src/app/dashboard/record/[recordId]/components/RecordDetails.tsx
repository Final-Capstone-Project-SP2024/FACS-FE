'use client';
import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import Image from 'next/image';

const firebaseConfig = {
  apiKey: "AIzaSyD_kES-S_Kg6loaZmTIQdlTjs9danQqAoM",
  projectId: "final-capstone-project-f8bdd",
  storageBucket: "final-capstone-project-f8bdd.appspot.com",
};

const app = initializeApp(firebaseConfig);

const handleGetRecordDetails = async (recordId: string, token: string | undefined) => {
  try {
    const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Record/${recordId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching record details: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error(`Error fetching record details:`, error);
    throw error;
  }
};

export default function RecordDetails({ recordId, token }: { recordId: string, token: string | undefined }) {
  const [record, setRecord] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (recordId && token) {
        const data = await handleGetRecordDetails(recordId, token);
        setRecord(data);

        const imageName = data.imageRecord?.imageUrl;
        const videoName = data.videoRecord?.videoUrl;

        if (imageName) {
          const storage = getStorage(app);
          const imageRef = ref(storage, `ImageRecord/${imageName}`);
          const imageUrl = await getDownloadURL(imageRef);
          setImageUrl(imageUrl);
        }

        if (videoName) {
          const storage = getStorage(app);
          const videoRef = ref(storage, `VideoRecord/${videoName}`);
          const videoUrl = await getDownloadURL(videoRef);
          setVideoUrl(videoUrl);
        }
      }
    };

    fetchData();
  }, [recordId, token]);

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (!record) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="font-bold text-xl mb-2">{record.cameraName}</h2>
        <p className="mb-2">Camera Destination: {record.cameraDestination}</p>
        <p className="mb-2">Predicted Percent: {record.predictedPercent}%</p>
        <p className="mb-2">User Rating Percent: {record.userRatingPercent}%</p>
        <p className="mb-2">Status: {record.status}</p>
        {imageUrl ? (
          <div className="mb-4">
            <Image src={imageUrl} alt="Record Image" width={400} height={400} className="rounded-lg shadow-md" />
          </div>
        ) : (
          <div className="text-gray-500 mb-4">No Image Available</div>
        )}
        {videoUrl ? (
          <div className="mt-4">
            <video width="400" height="300" controls className="rounded-lg shadow-md">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="text-gray-500 mt-4">No Video Available</div>
        )}
      </div>
    </div>
  );
}
