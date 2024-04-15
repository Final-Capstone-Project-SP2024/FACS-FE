import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getUsers } from '@/app/lib';
import { IUsers } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react';
import { AddUser, UpdateUser, UserTable } from './components';
import Pagination from './components/Pagination';

type SearchParamsProps = {
  searchParams: { Page: string };
};

export default async function User({ searchParams }: SearchParamsProps, token: string | undefined) {
  const session = await getServerSession(authOptions);
  token = session?.user.data.accessToken;
  // const listUsers: IUsers = await getUsers(token);
  // console.log(listUsers?.data.results);
  // const user = listUsers?.data.results;
  console.log(searchParams.Page);

  return (
    <div className='container mx-auto'>
      <h1 className="text-2xl font-bold my-4">User List</h1>
      <div className="mr-6 float-right">
        <AddUser token={token} />
      </div>
      <UserTable token={token} />
      {/* <Pagination totalItem={listUsers?.data.totalNumberOfRecords} currentPage={parseInt(searchParams.Page)} renderPageLink={(page) => `/dashboard/user?Page=${page}}`} /> */}
    </div>
  );
}