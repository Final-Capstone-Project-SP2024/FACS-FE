import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { IRecords } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react';
import RecordRow from './components/RecordRow';

export default async function Record({ params }: { params: { locationId: string } }, token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;


  return (
    <div className="container mx-auto">
      <RecordRow token={token}/>
    </div>
  );
}