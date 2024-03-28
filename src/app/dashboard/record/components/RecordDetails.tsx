import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getRecordsDetails } from '@/app/lib/api';
import { IRecordsDetail } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function RecordDetails(recordId: string, token: string | undefined) {
    const session = await getServerSession(authOptions);
    token = session?.user.data.accessToken;
    console.log(recordId)
    const recordDetails: IRecordsDetail = await getRecordsDetails(token, recordId);
    console.log(recordDetails)
    return (
        <div>
            {/* <h1>Record Details</h1>
            <p>{recordDetails.results.id}</p>
            <p>{recordDetails.results.status}</p>
            <p>{recordDetails.results.recordTime}</p>
            <p>{recordDetails.results.userRatingPercent}</p>
            <p>{recordDetails.results.predictedPercent}</p>
            <p>{recordDetails.results.createdDate}</p> */}
            hello world
        </div>
    )
}
