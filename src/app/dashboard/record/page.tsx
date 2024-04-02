import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getRecords } from '@/app/lib';
import { IRecords } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react';
import RecordTable from './components/RecordTable';

export default async function Record(token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  const listRecords: IRecords = await getRecords(token);

  return (
    listRecords && <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Record List</h1>
      <RecordTable body={listRecords} token={token} />
    </div>
  );
}
