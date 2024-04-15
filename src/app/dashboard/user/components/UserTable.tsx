'use client';
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
    locationName: string;
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
            return {
                users: apiResponse.data.results,
                totalPages: apiResponse.data.totalNumberOfPages,
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
        <div className="flex flex-wrap space-x-4 mb-4">
            <input
                type="text"
                placeholder="Filter by name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <select
                value={filters.roleName}
                onChange={(e) => setFilters({ ...filters, roleName: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg"
            >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
            </select>
            <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg"
            >
                <option value="">Select Status</option>
                <option value="actived">Active</option>
                <option value="inactived">Inactive</option>
            </select>
        </div>
    );

    const tableHeader = (
        <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-2 border">Security Code</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Update</th>
            </tr>
        </thead>
    );

    const paginationControls = (
        <div className="flex items-center mt-4 space-x-4">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
                Previous
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
                Next
            </button>
        </div>
    );

    return (
        <>
            {filterUI}
            {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : users.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    {tableHeader}
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="px-4 py-2 border">{user.securityCode}</td>
                                <td className="px-4 py-2 border">{user.email}</td>
                                <td className="px-4 py-2 border">{user.name}</td>
                                <td className="px-4 py-2 border">{user.phone}</td>
                                <td className="px-4 py-2 border">{user.role.roleName}</td>
                                <td className="px-4 py-2 border">{user.status}</td>
                                <td className="px-4 py-2 border">{user.locationName}</td>
                                <td className="px-4 py-2 border">
                                    {
                                        user.role.roleName !== 'Manager' ? (
                                            <UpdateUser
                                                token={user.token}
                                                userId={user.id}
                                                user={user}
                                                onUpdate={() => {
                                                    setCurrentPage(currentPage);
                                                }}
                                            />
                                        ) : null
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center text-gray-500">No users found</div>
            )}
            {paginationControls}
        </>
    );
}
