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
  // console.log(session?.user.data.accessToken);
  token = session?.user.data.accessToken;
  const listUsers: IUsers = await getUsers(token);
  // console.log(listUsers?.data.results);
  const user = listUsers?.data.results;
  console.log(searchParams.Page);

  return (
    <div>
      <div className="mb-4">
        <AddUser token={token} />
      </div>
      <table>
        <thead>
          <tr>
            <th className="border px-4 py-2">Security Code</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {user.map((user) => (
            <UserTable id={user.id} securityCode={user.securityCode} email={user.email} name={user.name} phone={user.phone} role={user.role} status={user.status} token={token} />
          ))}
        </tbody>
      </table>
      <Pagination totalItem={listUsers?.data.totalNumberOfRecords} currentPage={parseInt(searchParams.Page)} renderPageLink={(page) => `/dashboard/user?Page=${page}`} />
    </div>
  );
}