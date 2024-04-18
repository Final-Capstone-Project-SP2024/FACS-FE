import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getLocation } from '@/app/lib';
import { ILocations } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react'
import { AddLocation, GetLocation } from './components';

export default async function Location({ params }: { params: { locationId: string } }, token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  const listLocations: ILocations = await getLocation(token);
  const location = listLocations?.data;
  console.log(location);
  return (
    <div className='container mx-auto'>
      <h1 className="text-2xl font-bold mt-4">Location List</h1>
      <div className="mb-2 float-right"><AddLocation token={token} /></div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="border px-4 py-2 border">Index</th>
            <th className="border px-4 py-2 border">Location Name</th>
            <th className="border px-4 py-2 border">Number Of Camera</th>
            <th className="border px-4 py-2 border">Number Of Security</th>
          </tr>
        </thead>
        <tbody>
          <GetLocation token={token} />
        </tbody>
      </table>
    </div>
  )
}
