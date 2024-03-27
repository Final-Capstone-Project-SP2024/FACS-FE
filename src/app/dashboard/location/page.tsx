import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getLocation } from '@/app/lib';
import { ILocations } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function Location(token : string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  const listLocations: ILocations = await getLocation(token);
  const location = listLocations?.data;
  console.log(location);
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className="border px-4 py-2">Location Name</th>
          </tr>
        </thead>
        <tbody>
          {location.map((location) => (
            <tr key={location.id}>
              <td className="border px-4 py-2">{location.locationName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
