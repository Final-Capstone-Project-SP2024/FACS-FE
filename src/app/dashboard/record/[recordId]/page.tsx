import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { RecordDetails } from './components';
import { IRecordsDetail } from '@/app/types';
import { getRecordsDetails } from '@/app/lib/api';

export default async function page({ params }: { params: { recordId: string } }, token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  
  try {
    const recordPromises: IRecordsDetail = await getRecordsDetails(token, params.recordId);
    console.log(recordPromises);

    return (
      <div>
        <h2>Record Details</h2>
        <p>Camera ID: {recordPromises.data.cameraId}</p>
        <p>Camera Destination: {recordPromises.data.cameraDestination}</p>
        <p>Rating Result: {recordPromises.data.ratingResult}</p>
        <p>Record ID: {recordPromises.data.recordId}</p>
        <p>User Rating Percent: {recordPromises.data.userRatingPercent}</p>
        <p>Predicted Percent: {recordPromises.data.predictedPercent}</p>
        <p>Status: {recordPromises.data.status}</p>
        {recordPromises.data.videoRecord && (
          <p>Video URL: {recordPromises.data.videoRecord.videoUrl}</p>
        )}
        {recordPromises.data.imageRecord && (
          <p>Image URL: {recordPromises.data.imageRecord.videoUrl}</p>
        )}
        <p>User Ratings:</p>
        <ul>
          {recordPromises.data.userRatings.map((rating, index) => (
            <li key={index}>
              UserID: {rating.userId}, Rating: {rating.rating}
            </li>
          ))}
        </ul>
        <p>User Votings:</p>
        <ul>
          {recordPromises.data.userVoting.map((vote, index) => (
            <li key={index}>
              UserID: {vote.userId}, Vote Level: {vote.voteLevel}, Vote Type: {vote.voteType}
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Error fetching record details:', error);
    return <div>Error fetching record details</div>;
  }
}
