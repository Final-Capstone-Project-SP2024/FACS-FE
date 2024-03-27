import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getCamera } from '@/app/lib';
import { ICameras } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function Camera(token : string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  const listCameras: ICameras = await getCamera(token);
  const camera = listCameras?.data;
  console.log(camera);
  return (
    <div className='mb-4'>
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
              <td className="border px-4 py-2">{camera.cameraName}</td>
              <td className="border px-4 py-2">{camera.cameraDestination}</td>
              <td className="border px-4 py-2">{camera.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
