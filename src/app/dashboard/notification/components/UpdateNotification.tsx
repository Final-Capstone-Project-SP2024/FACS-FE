'use client'
import React, { useState } from 'react';
import { toast } from 'react-toastify';

type Notification = {
    id: number;
    name: string;
    context: string;
    title: string;
};

type UpdateNotificationProps = {
    notification: Notification;
    token: string | undefined;
    onClose: () => void;
};

export default function UpdateNotification({ notification, token, onClose }: UpdateNotificationProps) {
    const [title, setTitle] = useState(notification.title);
    const [context, setContext] = useState(notification.context);
    // console.log(notification.id);

    const updateNotification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = `https://firealarmcamerasolution.azurewebsites.net/api/v1/Notification/${notification.id}`;
        const body = JSON.stringify({ title, context });

        try {
            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: body,
            });

            if (res.ok) {
                toast.success('Notification updated successfully');
                onClose();
            } else {
                const errorData = await res.json();
                toast.error(errorData.Message || 'Failed to update notification');
            }
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Update Notification</h3>
                    <form onSubmit={updateNotification} className="mt-2">
                        <input
                            type="text"
                            className="mt-2 px-3 py-2 border border-gray-300 rounded-md w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="mt-2 px-3 py-2 border border-gray-300 rounded-md w-full"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                        />
                        <div className="items-center px-4 py-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}