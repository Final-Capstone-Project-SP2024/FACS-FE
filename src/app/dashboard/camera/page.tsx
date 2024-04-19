import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import React from 'react'
import { GetCamera } from './components';

export default async function Camera({ params }: { params: { locationId: string } }, token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  return (
    <div className='mb-4 bg-gray-100'>
      <GetCamera token={token}/>
    </div>
  )
}
