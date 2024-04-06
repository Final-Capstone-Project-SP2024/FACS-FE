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

const handleGetUser = async (token: string | undefined, page: number, filters: { name?: string; roleName?: string; status?: string }) => {
    const { name, roleName, status } = filters;
    var url = `https://firealarmcamerasolution.azurewebsites.net/api/v1/User?Page=${page}&PageSize=10`;

    if (status) {
        url += `&Status=${encodeURIComponent(status)}`;
    }
    if (name) {
        url += `&Name=${encodeURIComponent(name)}`;
    }
    if (roleName) {
        url += `&RoleName=${encodeURIComponent(roleName)}`;
    }
    console.log(`URL: ${url}`); // Debug line
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
    const [filters, setFilters] = useState<{ name?: string; roleName?: string; status?: string }>({
        name: '',
        roleName: '',
        status: '',
    });

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { users: fetchedUsers, totalPages: newTotalPages } = await handleGetUser(token, currentPage, filters);
            setUsers(fetchedUsers);
            setTotalPages(newTotalPages);
            setLoading(false);
        };

        fetchUsers();
    }, [token, currentPage, filters]);

    const filterUI = (
        <div>
            <input
                type="text"
                placeholder="Filter by name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Filter by role"
                value={filters.roleName}
                onChange={(e) => setFilters({ ...filters, roleName: e.target.value })}
            />
            <input
                type="text"
                placeholder="Filter by status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            />
            {/* <button onClick={() => { setUsers([]); setLoading(true); setCurrentPage(1); }}>Apply Filters</button> */}
        </div>
    );

    const tableHeader = (
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
    );

    return (
        <>
            {filterUI}
            {loading ? (
                <div>Loading...</div>
            ) : users.length > 0 ? (
                <table>
                    {tableHeader}
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
            ) : (
                <>
                    <table>{tableHeader}</table>
                    <div>No users found</div>
                </>
            )}
            <div>
                <button onClick={() => setCurrentPage((currentPage) => Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages))} disabled={currentPage >= totalPages}>
                    Next
                </button>
            </div>
        </>
    );
}