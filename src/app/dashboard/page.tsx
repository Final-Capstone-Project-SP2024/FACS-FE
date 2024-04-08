import React from 'react'
import { Chart } from './components'
import { Card } from './components'
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';

export default async function page(token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  return (
    <div className='gap-5  mt-5 flex pl-3'>
      <div className='flex-3 flex gap-5  flex-col '>
        <div className='flex gap-5 justify-between'>
          <Card input={"user"} numberAdd={"1000"} type={"Total User"} />
          <Card input={"location"} numberAdd={"1000"} type={"Location"} />
          <Card input={"camera"} numberAdd={"Camera Name"} type={"Fire-Detect Camera"} />
        </div>
      </div>

      <Chart token={token} />
    </div>
  )
}
