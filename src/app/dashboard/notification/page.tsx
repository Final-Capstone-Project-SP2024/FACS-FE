import React from 'react'
import { GetNotification } from './components'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';


type SearchParamsProps = {
    searchParams: { Page: string };
};

export default async function page({ searchParams }: SearchParamsProps, token: string | undefined) {
    const session = await getServerSession(authOptions);
    token = session?.user.data.accessToken;
    return (
        <div>
            <GetNotification token = {token} />
        </div>
    )
}
