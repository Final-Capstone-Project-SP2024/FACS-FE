import React from 'react'
import UpdateUser from './UpdateUser'

type PaginationProps = {
}

type user = {
    id: string,
    securityCode: string,
    email: string,
    name: string,
    phone: string,
    role: {
        roleName: string
    }
    status: string,
    token: string | undefined
}

const handleGetUser = async (token: string | undefined) => {
    try {
        const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/User`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            console.log(res.json());
            console.log('User updated successfully');
            return res.json();
        } else {
            console.error('Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }

}
export default function UserTable({ id, securityCode, email, name, phone, role, status, token }: user) {

    return (
        <tr>
            <td className="border px-4 py-2">{securityCode}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">{name}</td>
            <td className="border px-4 py-2">{phone}</td>
            <td className="border px-4 py-2">{role.roleName}</td>
            <td className="border px-4 py-2">{status}</td>
            <td className="border px-4 py-2">
                <UpdateUser userId={id} token={token} />
            </td>
        </tr>
    )
}
