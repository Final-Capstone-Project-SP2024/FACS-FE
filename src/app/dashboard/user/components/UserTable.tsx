'use client';
import React, { useEffect, useState } from 'react';
import UpdateUser from './UpdateUser';
import AddUser from './AddUser';
import { toast } from 'react-toastify';

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
    locations: {
        locationName: string;
    }[];
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
    const fetchUsers = async () => {
        setLoading(true);
        const { users: fetchedUsers, totalPages: newTotalPages } = await handleGetUser(token, currentPage, filters);
        setUsers(fetchedUsers);
        setTotalPages(newTotalPages);
        setLoading(false);
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleRowClick = (user: User) => {
        if (user.role.roleName !== 'Manager') {
            setSelectedUser(user);
            setShowModal(true);
        } else {
            toast.error('Update is not allowed for Manager role.');
            // console.log('Update is not allowed for Manager role.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token, currentPage, filters]);

    const filterUI = (
        <div className="flex justify-between items-center mb-4">
            <div className="flex flex-wrap space-x-4">
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
            <AddUser token={token} onUserAdded={fetchUsers} />
        </div>
    );

    const tableHeader = (
        <thead className="bg-gray-100">
            <tr>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Security Code</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Email</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Name</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Phone</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Role</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Status</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Location</th>
            </tr>
        </thead>
    );

    const paginationControls = (
        <div className="flex items-center justify-center space-x-4 mt-4">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
                Previous
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
                Next
            </button>
        </div>
    );

    return (
        <div className='bg-gray-100 p-4'>
            {filterUI}
            {loading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : users.length > 0 ? (
                <div className="overflow-x-auto p-3 bg-white">
                    <table className="table-auto w-full  border border-gray-300 bg-white">
                        {tableHeader}
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50" onClick={() => handleRowClick(user)}>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{user.securityCode}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{user.email}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{user.name}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{user.phone}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{user.role.roleName}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">
                                        <span className={`inline-block px-3 py-1 rounded font-bold ${user.status === 'Active' ? 'border border-green-400 text-green-400 bg-green-50' :
                                            user.status === 'Inactive' ? 'border border-red-500 text-red-500 bg-red-100' :
                                                'border-gray-300'
                                            }`}>{user.status}
                                        </span>
                                    </td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">
                                        {user.locations.map(loc => loc.locationName).join(', ')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500 font-bold text-2xl">No users found</div>
            )}
            {paginationControls}
            {selectedUser && (
                <UpdateUser
                    userId={selectedUser.id}
                    user={selectedUser}
                    onUpdate={() => {
                        fetchUsers();
                    }}
                    token={token}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </div>
    );
}