'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type RecordProps = {
  id: number;
  status: string;
  recordTime: string;
  userRatingPercent: number;
  predictedPercent: number;
  createdDate: string;
  userRatings: {
    userId: string;
    rating: number;
  }[];
  userVotings: {
    userId: string;
    voteLevel: number;
    voteType: {
      actionName: string;
    };
  }[];
  recordType: {
    recordTypeId: number;
    recordTypeName: string;
  };
  notificationLogs: {
    count: number;
    notificationType: {
      notificationTypeId: number;
      name: string;
    };
  }[];
  token: string | undefined;
};

const RecordRow = ({ token }: { token: string | undefined }) => {
  const [records, setRecords] = useState<RecordProps[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch('https://firealarmcamerasolution.azurewebsites.net/api/v1/Record', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const apiResponse = await res.json();
          console.log('Records fetched successfully');
          console.log(apiResponse.results);
          setRecords(apiResponse.results);
        } else {
          console.error('Failed to fetch records');
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, [token]);

  return (
    <>
      {records.map((record, index) => (
        <tr key={index} className="border-b border-gray-200">
          <td className="px-4 py-2">{record.status}</td>
          <td className="px-4 py-2">{record.recordTime}</td>
          <td className="px-4 py-2">{record.userRatingPercent}</td>
          <td className="px-4 py-2">{record.predictedPercent}</td>
          <td className="px-4 py-2">{record.createdDate}</td>
          <td className="px-4 py-2">{record.recordType.recordTypeId}</td>
          <td className="px-4 py-2">{record.recordType.recordTypeName}</td>
          <td className="px-4 py-2">
            {record.userRatings.map((rating, index) => (
              <div key={index}>
                <p>User ID: {rating.userId}</p>
                <p>Rating: {rating.rating}</p>
              </div>
            ))}
          </td>
          <td className="px-4 py-2">
            {record.userVotings.map((voting, index) => (
              <div key={index}>
                <p>User ID: {voting.userId}</p>
                <p>Vote Level: {voting.voteLevel}</p>
                <p>Vote Type: {voting.voteType.actionName}</p>
              </div>
            ))}
          </td>
          <td className="px-4 py-2">
            {record.notificationLogs.map((log, index) => (
              <div key={index}>
                <p>Count: {log.count}</p>
                <p>Notification Type: {log.notificationType.name}</p>
              </div>
            ))}
          </td>
          <td className="px-4 py-2">
            <Link href="/dashboard/record/[recordId]" as={`/dashboard/record/${record.id}`}>
              View Details
            </Link>
          </td>
        </tr>
      ))}
    </>
  );
};

export default RecordRow;
