import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { RecordDetails } from './components';

export default async function page({ params }: { params: { recordId: string } }, token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
    return (
      <div>
        <RecordDetails recordId={params.recordId} token={token} />
      </div>
    );

}
