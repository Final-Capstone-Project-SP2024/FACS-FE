import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getRecords } from '@/app/lib';
import { IRecords } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react';
import RecordRow from './components/RecordRow';

export default async function Record(token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  const listRecords: IRecords = await getRecords(token);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Record List</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Record Time</th>
            <th className="px-4 py-2">User Rating Percent</th>
            <th className="px-4 py-2">Predicted Percent</th>
            <th className="px-4 py-2">Created Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listRecords.results.map((record) => (
            <RecordRow
              key={record.id}
              recordId={record.id}
              status={record.status}
              recordTime={record.recordTime}
              userRatingPercent={record.userRatingPercent}
              predictedPercent={record.predictedPercent}
              createdDate={record.createdDate}
              token={token}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
