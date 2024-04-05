import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getUsers } from '@/app/lib';
import { IUsers } from '@/app/types';
import { getServerSession } from 'next-auth';
import React from 'react';
import { AddUser, UpdateUser } from './components';

type SearchParamsProps = {
  searchParams: { page: string };
};

export default async function User({ searchParams }: SearchParamsProps, token: string | undefined) {
  const session = await getServerSession(authOptions);
  // console.log(session?.user.data.accessToken);
  token = session?.user.data.accessToken;
  const listUsers: IUsers = await getUsers(token);
  // console.log(listUsers?.data.results);
  const user = listUsers?.data.results;

  return (
    <div>
      <div className="mb-4">
        <AddUser token={token}/>
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
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.securityCode}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.phone}</td>
              <td className="border px-4 py-2">{user.role.roleName}</td>
              <td className="border px-4 py-2">{user.status}</td>
              <td className="border px-4 py-2">
                <UpdateUser userId={user.id} token={token}/>
              </td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}