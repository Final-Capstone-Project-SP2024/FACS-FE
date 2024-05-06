'use client';
import React, { useEffect, useState } from 'react';
import UpdateNotification from './UpdateNotification';

type GetNotificationProps = {
    token: string | undefined;
};

type Notification = {
    id: number;
    name: string;
    context: string;
    title: string;
};

export default function GetNotification({ token }: GetNotificationProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

    const handleRowClick = (notification: Notification, index: number) => {
        const notificationWithId = { ...notification, id: index + 1 };
        setSelectedNotification(notificationWithId);
    };

    const closeModal = () => {
        setSelectedNotification(null);
    };

    const fetchNotifications = async () => {
        setLoading(true);
        let fetchedNotifications: Notification[] = [];
        for (let notificationId = 1; notificationId <= 5; notificationId++) {
            const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Notification/${notificationId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                fetchedNotifications.push(data.data);
            } else {
                console.error(`Failed to fetch notification with ID ${notificationId}`);
            }
        }
        setNotifications(fetchedNotifications);
        setLoading(false);
    }

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    return (
        <div className='bg-gray-100 p-4'>
            <h2 className='text-2xl font-semibold mb-4'>Notifications</h2>
            {loading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : notifications.length > 0 ? (
                <div className="overflow-x-auto p-3 bg-white">
                    <table className="table-auto w-full border border-gray-300 bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">ID</th>
                                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Name</th>
                                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Context</th>
                                <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((notification, index) => (
                                <tr key={index} className="hover:bg-gray-50" onClick={() => handleRowClick(notification, index)}>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{index + 1}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{notification.name}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{notification.context}</td>
                                    <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{notification.title}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedNotification && (
                        <UpdateNotification
                            notification={selectedNotification}
                            token={token}
                            onClose={closeModal}
                        />
                    )}
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500 font-bold text-2xl">No notifications found</div>
            )}
        </div>
    );
}