import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import React from 'react'
import UserLocation from './components/UserLocation';
import { AddUserToLocation, LocationDetails } from './components';

export default async function page({ params }: { params: { locationId: string } }, token: string | undefined) {
    const session = await getServerSession(authOptions);
    token = session?.user.data.accessToken;
    return (
        <div>
            {/* <AddUserToLocation locationId = {params.locationId} token = {token}/> */}
            {/* <UserLocation locationId = {params.locationId} token = {token}/> */}
            <LocationDetails locationId = {params.locationId} token = {token}/>
        </div>
    )
}
