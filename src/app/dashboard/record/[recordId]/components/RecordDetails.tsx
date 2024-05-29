'use client';
import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import Image from 'next/image';
import { FaRegPlayCircle } from "react-icons/fa";
import AlarmLevel from './AlarmLevel';
import errorImg from '../../../../../../public/error-camera-icon.png'

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

type Vote = {
  securityCode: string;
  voteLevel: number;
  voteType: string;
};

type Responsibility = {
  userId: string;
  userName: string;
};

type Record = {
  userVoting: Vote[];
  userResponsibilities: Responsibility[];
};

export default function RecordDetails({ recordId, token }: { recordId: string, token: string | undefined }) {
  const [record, setRecord] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mainMediaUrl, setMainMediaUrl] = useState('');
  const [isImageMain, setIsImageMain] = useState(true);
  const [error, setError] = useState('');
  const [showUserVotingModal, setShowUserVotingModal] = useState<boolean>(false);
  const [showUserResponsibilitiesModal, setShowUserResponsibilitiesModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setError('');
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
            setMainMediaUrl(imageUrl);
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

  const calculateStroke = (percentage: number) => {
    const radius = 65;
    const circumference = 2 * Math.PI * radius;
    return `${(circumference * percentage) / 100} ${circumference}`;
  };

  const votingTableHeader = (
    <thead className="bg-gray-100">
      <tr>
        <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Index</th>
        <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Security Code</th>
        <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Vote Level</th>
        <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Vote Type</th>
      </tr>
    </thead>
  );

  const responsibilitiesTableHeader = (
    <thead className="bg-gray-100">
      <tr>
        <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Index</th>
        <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">User Name</th>
      </tr>
    </thead>
  );

  let recordTypeDescription;
  if (record.recordType === 1) {
    recordTypeDescription = 'AI Detection';
  } else if (record.recordType === 2) {
    recordTypeDescription = 'Electrical Incident';
  } else if (record.recordType === 3) {
    recordTypeDescription = 'Alarm By User';
  } else {
    recordTypeDescription = 'Unknown';
  }

  return (
    <div className="container bg-gray-100 p-4 mx-auto">
      <div className="bg-white rounded-lg shadow-md mb-4">
        <h2 className="font-bold text-3xl text-center py-4">Record Details - {recordTypeDescription}</h2>
      </div>
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className="bg-white rounded-lg shadow-md p-6 lg:w-1/2">
          <div>
            {mainMediaUrl ? (
              isImageMain ? (
                <Image
                  src={mainMediaUrl}
                  alt="Image"
                  layout="responsive"
                  width={1000}
                  height={562}
                  className="rounded-lg shadow-md"
                  priority
                />
              ) : (
                <video
                  width="100%"
                  controls
                  className="rounded-lg shadow-md"
                >
                  <source src={mainMediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <div className="flex flex-col justify-center items-center h-96">
                <Image src={errorImg} alt="Error" width={200} height={200} />
                <h1 className='my-6 font-bold text-xl'>Electrical Incident - No Image or Video available</h1>
              </div>
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
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 flex-1">
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 text-center">
                <h1 className="text-lg font-bold">Percentage</h1>
                <div className="relative inline-block">
                  <svg className="progress-ring" height="160" width="160">
                    <circle
                      className="progress-ring__circle"
                      stroke="#e6e6e6"
                      strokeWidth="15"
                      fill="transparent"
                      r="65"
                      cx="80"
                      cy="80"
                    />
                    <circle
                      className="progress-ring__circle"
                      stroke="#3b82f6"
                      strokeWidth="15"
                      fill="transparent"
                      r="65"
                      cx="80"
                      cy="80"
                      strokeLinecap="round"
                      strokeDasharray={calculateStroke(record.predictedPercent)}
                      strokeDashoffset="0"
                      transform="rotate(-90 80 80)"
                      style={{ transition: 'stroke-dasharray 0.5s ease 0s' }}
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold" style={{ color: record.predictedPercent ? '#3b82f6' : 'white', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute' }}>
                    {record.predictedPercent ? `${parseFloat(record.predictedPercent).toFixed(2)}%` : ''}
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center">
                <AlarmLevel levelText={record.recommendAlarmLevel} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-2 text-3xl"><span className="font-semibold">{record.cameraName}</span></p>
            <p className="mb-2 text-lg"><span className="font-semibold">Camera Destination:</span> {record.cameraDestination}</p>
            <p className="mb-2 text-lg"><span className="font-semibold">Time:</span> {record.recordTime} - {record.status === "InFinish" ? record.finishTime : "Not Finish Yet"}</p>
            <p className="mb-2 text-lg"><span className="font-semibold">Status:</span> {record.status}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4 mr-4"
              onClick={() => setShowUserVotingModal(true)}
            >
              User Ratings
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowUserResponsibilitiesModal(true)}
            >
              User Responsibilities
            </button>

            {/* Show User Voting Modal */}
            {showUserVotingModal && record && record.userVoting && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
                  <h1 className='font-bold text-2xl pb-4'>User Ratings</h1>
                  <table className="table-auto w-full border border-gray-300 bg-white">
                    {votingTableHeader}
                    <tbody>
                      {record.userVoting.map((vote: Vote, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{index + 1}</td>
                          <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{vote.securityCode}</td>
                          <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{(vote.voteLevel === 6 || vote.voteLevel === 7) ? null : vote.voteLevel}</td>
                          <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{vote.voteType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setShowUserVotingModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showUserResponsibilitiesModal && record && record.userResponsibilities && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
                  <h1 className='font-bold text-2xl pb-4'>User Responsibilities</h1>
                  <table className="table-auto w-full border border-gray-300 bg-white">
                    {responsibilitiesTableHeader}
                    <tbody>
                      {record.userResponsibilities.map((user: Responsibility, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{index + 1}</td>
                          <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{user.userName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end">
                    <button
                      className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4"
                      onClick={() => setShowUserResponsibilitiesModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
