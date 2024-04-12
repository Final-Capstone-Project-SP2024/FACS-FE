import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getCamera } from '@/app/lib';
import { ICameras } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react'
import { AddCamera, GetCamera } from './components';

export default async function Camera({ params }: { params: { locationId: string } }, token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  const listCameras: ICameras = await getCamera(token);
  const camera = listCameras?.data;
  // console.log(camera);
  return (
    <div className='mb-4'>
      <AddCamera token={token}/>
      <table>
        <thead>
          <tr>
            <th className="border px-4 py-2">Camera Name</th>
            <th className="border px-4 py-2">Camera Destination</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {camera.map((camera) => (
            <tr key={camera.id}>
              <GetCamera id={camera.id} cameraName={camera.cameraName} cameraDestination={camera.cameraDestination} status={camera.status}/>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
