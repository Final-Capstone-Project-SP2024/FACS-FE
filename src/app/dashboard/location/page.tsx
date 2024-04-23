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
  // console.log(location);

  return (
    <div className='container mx-auto'>
      <GetLocation token={token} />
    </div>
  )
}
