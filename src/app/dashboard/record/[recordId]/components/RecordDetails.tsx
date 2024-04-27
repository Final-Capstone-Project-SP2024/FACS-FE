'use client';
import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import Image from 'next/image';
import { FaRegPlayCircle } from "react-icons/fa";

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
  const [mainMediaUrl, setMainMediaUrl] = useState('');
  const [isImageMain, setIsImageMain] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setError(''); // Reset errors before fetching new data
      if (recordId && token) {
        try {
          const data = await handleGetRecordDetails(recordId, token);
          setRecord(data);

          const imageName = data.imageRecord?.imageUrl;
          const videoName = data.videoRecord?.videoUrl;

          if (imageName) {
            const storage = getStorage(app);
            const imageRef = ref(storage, `ImageRecord/${imageName}`);
            const imageUrl = await getDownloadURL(imageRef);
            setImageUrl(imageUrl);
            setMainMediaUrl(imageUrl); // Set the image URL as default main media
          }

          if (videoName) {
            const storage = getStorage(app);
            const videoRef = ref(storage, `VideoRecord/${videoName}`);
            const videoUrl = await getDownloadURL(videoRef);
            setVideoUrl(videoUrl);
          }
        } catch (error) {
          console.error('Error fetching record details:', error);
          setError('Failed to load record details.');
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

  const handleImageClick = () => {
    setMainMediaUrl(imageUrl);
    setIsImageMain(true);
  };

  const handleVideoClick = () => {
    setMainMediaUrl(videoUrl);
    setIsImageMain(false);
  };

  return (
    <div className="container bg-gray-100 p-4 mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="font-bold text-3xl mb-2">Record Details</h2>
        <div className='flex flex-row gap-2'>
          <div className="w-1/2">
            <div>
              {isImageMain ? (
                <Image src={mainMediaUrl} alt="Main Media" width={1000} height={1000} className="rounded-lg shadow-md" priority />
              ) : (
                <video width="1000" height="1000" controls className="rounded-lg shadow-md">
                  <source src={mainMediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className='flex flex-row mt-2 gap-2'>
              {imageUrl && (
                <div
                  className="cursor-pointer"
                  onClick={handleImageClick}
                >
                  <Image src={imageUrl} alt="Record Image" width={150} height={150} className="rounded-lg shadow-md" />
                </div>
              )}
              {videoUrl && (
                <div
                  className="cursor-pointer video-container relative"
                  onClick={handleVideoClick}
                >
                  <video width="150" height="150" className="rounded-lg shadow-md">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="play-icon-container absolute inset-0 flex justify-center items-center">
                    <FaRegPlayCircle className="play-icon text-white text-6xl" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-1/2">
            <p className="mb-2">{record.cameraName}</p>
            <p className="mb-2">Camera Destination: {record.cameraDestination}</p>
            <p className="mb-2">Predicted Percent: {record.predictedPercent}%</p>
            <p className="mb-2">Finish Time: {record.finishTime}</p>
            <p className="mb-2">Status: {record.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
