import React from 'react';
import { Chart } from './components';
import { Card } from './components';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';

export default async function page(token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;

  return (
    <div className='flex flex-col justify-between px-3'>
      <div className='flex flex-wrap gap-5'>
        <Card input={"user"} numberAdd={"1000"} type={"Total User"} />
        <Card input={"location"} numberAdd={"1000"} type={"Location"} />
        <Card input={"camera"} numberAdd={"Camera Name"} type={"Fire-Detect Camera"} />
      </div>
      <div className='flex flex-wrap gap-2'>
        <div className='flex-1'>
          <Chart token={token} />
        </div>
        <div className='flex-1'>
          <Chart token={token} />
        </div>
      </div>

    </div>
  );
}