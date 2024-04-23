import React from 'react';
import { Chart, PieChart } from './components';
import { Card } from './components';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { ICameras, ILocations, IRecords, IUsers } from '../types';
import { getCamera, getLocation, getTop5Records, getUsers } from '../lib';

function addSpacesToCamelCase(text: string) {
  return text.replace(/([A-Z])/g, ' $1').trim();
}

export default async function page({ params }: { params: { locationId: string } }, token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;

  const listCameras: ICameras = await getCamera(token);
  const camera = listCameras?.data;
  const totalCamera = camera?.length;
  const activeCameras = camera.filter(camera => camera.status === 'Connected').length;
  const disconnectedCameras = camera.filter(camera => camera.status === 'Disconnected');

  const listLocations: ILocations = await getLocation(token);
  const location = listLocations?.data;
  const totalLocation = location?.length;

  const listUsers: IUsers = await getUsers(token);
  const totalUser = listUsers?.data.totalNumberOfRecords

  const listRecords: IRecords = await getTop5Records(token);
  const totalRecords = listRecords.totalNumberOfRecords;
  // console.log(listRecords);

  return (
    <div className='container mx-auto p-4 bg-gray-100'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card input={"user"} numberAdd={totalUser + ''} type={"Total Security"} />
        <Card input={"location"} numberAdd={totalLocation + ''} type={"Total Location"} />
        <Card input={"camera"} numberAdd={activeCameras + ' / ' + totalCamera} type={"Total Camera Connected"} />
        <Card input={"record"} numberAdd={totalRecords + ''} type={"Total Record"} />
      </div>
      <div className='mb-4 grid grid-cols-4 gap-4'>
        <div className='col-span-3'>
          <div className="bg-white p-4 rounded-md shadow-md">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th scope="col" className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Record Time
                  </th>
                  <th scope="col" className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Record Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {listRecords.results.map((record, index) => (
                  <tr key={record.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-5 py-2 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{record.status}</p>
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {new Date(record.recordTime).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 text-sm">
                      <p className={`whitespace-no-wrap inline-block px-2 py-1 rounded 
                      ${record.recordType.recordTypeName === 'Detection' ? 'border border-green-500 text-green-500 bg-green-100 font-bold' :
                          record.recordType.recordTypeName === 'ElectricalIncident' ? 'border border-yellow-800 text-yellow-800 bg-yellow-200 font-bold' :
                            record.recordType.recordTypeName === 'AlarmByUser' ? 'border border-red-500 text-red-500 bg-red-100 font-bold' :
                              'border border-gray-300 text-gray-900 bg-gray-100'
                        }`}>
                        {addSpacesToCamelCase(record.recordType.recordTypeName)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='col-span-1'>
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-base font-semibold mb-4">Disconnected Cameras</h2>
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Destination
                  </th>
                </tr>
              </thead>
              <tbody>
                {disconnectedCameras.map((camera, index) => (
                  <tr key={camera.cameraId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-2 border-b border-gray-200 text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">{camera.cameraName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{camera.cameraDestination}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='p-4 bg-white shadow rounded-md' style={{ height: '100%' }}>
          <PieChart />
        </div>
        <div className='flex flex-col gap-4 h-{50%}'>
          <div className='p-4 bg-white shadow rounded-md flex-1'>
            <Chart token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}