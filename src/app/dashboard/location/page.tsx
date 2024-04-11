import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getLocation } from '@/app/lib';
import { ILocations } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react'
import { AddLocation, GetLocation } from './components';

export default async function Location(token : string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  const listLocations: ILocations = await getLocation(token);
  const location = listLocations?.data;
  console.log(location);
  return (
    <div>
      <AddLocation token={token} />
      <table>
        <thead>
          <tr>
            <th className="border px-4 py-2">Location Name</th>
            <th className="border px-4 py-2">Number Of Camera</th>
            <th className="border px-4 py-2">Number Of Security</th>
          </tr>
        </thead>
        <tbody>
          <GetLocation token={token} />
        </tbody>
      </table>
    </div>
  )
}
