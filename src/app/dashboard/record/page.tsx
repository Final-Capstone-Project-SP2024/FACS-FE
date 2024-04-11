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
      <RecordRow token={token}/>
    </div>
  );
}