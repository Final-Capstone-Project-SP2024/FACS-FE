'use client'
import React, { useEffect, useState } from 'react';
import UpdateUser from './UpdateUser';

type ApiResponse = {
    data: {
        pageNumber: number;
        pageSize: number;
        totalNumberOfPages: number;
        totalNumberOfRecords: number;
        results: User[];
    };
};

type User = {
    id: string;
    securityCode: string;
    email: string;
    name: string;
    phone: string;
    role: {
        roleName: string;
    };
    status: string;
    token: string | undefined;
};

const handleGetUser = async (token: string | undefined, page: number) => {
    var url = `https://firealarmcamerasolution.azurewebsites.net/api/v1/User?Page=${page}&PageSize=10`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            const apiResponse: ApiResponse = await res.json();
            console.log('Users fetched successfully');
            console.log(apiResponse);
            return {
                users: apiResponse.data.results,
                totalPages: apiResponse.data.totalNumberOfPages, // Ensure this is correctly parsed
            };
        } else {
            console.error('Failed to fetch users');
            return { users: [], totalPages: 0 };
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return { users: [], totalPages: 0 };
    }
};

export default function UserTable({ token }: { token: string | undefined }) {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { users: fetchedUsers, totalPages: newTotalPages } = await handleGetUser(token, currentPage);
            setUsers(fetchedUsers);
            setTotalPages(newTotalPages);
            setLoading(false);
            console.log(`Total Pages: ${newTotalPages}`); // Add this line to debug
        };

        fetchUsers();
    }, [token, currentPage]);

    const goToNextPage = () => {
        if (typeof totalPages === 'number' && !isNaN(totalPages)) {
            setCurrentPage(current => Math.min(current + 1, totalPages));
        }
    };
    const goToPreviousPage = () => setCurrentPage(current => Math.max(1, current - 1));

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!users || users.length === 0) {
        return <div>No users found</div>;
    }
    console.log(`Current Page: ${currentPage}, Total Pages: ${totalPages}`);

    return (
        <>
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
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2">{user.securityCode}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">{user.name}</td>
                            <td className="border px-4 py-2">{user.phone}</td>
                            <td className="border px-4 py-2">{user.role.roleName}</td>
                            <td className="border px-4 py-2">{user.status}</td>
                            <td className="border px-4 py-2">
                                <UpdateUser userId={user.id} token={token} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={goToNextPage} disabled={currentPage >= totalPages}>
                    Next
                </button>
            </div>
        </>
    );
}
