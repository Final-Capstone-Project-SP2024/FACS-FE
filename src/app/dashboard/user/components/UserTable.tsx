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

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleRowClick = (user: User) => {
        if (user.role.roleName !== 'Manager') {
            setSelectedUser(user);
            setShowModal(true);
        } else {
            console.log('Update not allowed for Manager role.');
        }
    };

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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>
    );

    const tableHeader = (
        <thead className="bg-gray-100">
            <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Security Code</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Phone</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Role</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Location</th>
                {/* <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Update</th> */}
            </tr>
        </thead>
    );

    const paginationControls = (
        <div className="flex items-center justify-center space-x-4 mt-4">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-[#F87171] hover:bg-[#EF4444] text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
            >
                Previous
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="bg-[#F87171] hover:bg-[#EF4444] text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
            >
                Next
            </button>
        </div>
    );

    return (
        <div className='m-3'>
            {filterUI}
            {loading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300 bg-white">
                        {tableHeader}
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50" onClick={() => handleRowClick(user)}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{user.securityCode}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{user.email}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{user.name}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{user.phone}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{user.role.roleName}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{user.status}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{user.locationName}</td>
                                    {/* <td className="border border-gray-300 px-4 py-2 text-center">
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
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500">No users found</div>
            )}
            {paginationControls}
            {selectedUser && (
                <UpdateUser
                    userId={selectedUser.id}
                    user={selectedUser}
                    onUpdate={() => {
                    }}
                    token={token}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </div>
    );
}