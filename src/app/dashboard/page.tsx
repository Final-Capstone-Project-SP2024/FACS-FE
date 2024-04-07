import React from 'react'
import { Chart } from './components'
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';

export default async function page(token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  return (
    <div>
      dashboard
      <Chart token={token}/>
    </div>
  )
}
