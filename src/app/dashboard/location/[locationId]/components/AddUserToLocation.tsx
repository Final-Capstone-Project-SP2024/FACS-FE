import React, { useState } from 'react'

export default function AddUserToLocation(locationId: string, token: string | undefined) {
    const [userId, setUserId] = useState('');

    const handleAddUserToLocation = async ({ locationId, token }: { locationId: string, token: string | undefined }) => {
        const res = await fetch(`https://firealarmusersolution.azurewebsites.net/api/v1/Location/${locationId}/addstaff`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId })
        });
        if (res.ok) {
            console.log('User added to location successfully');
        } else {
            console.error('Failed to add user to location');
        }
    }

    const handleGetUser = async (token: string | undefined) => {
        const response = await fetch('https://firealarmusersolution.azurewebsites.net/api/v1/User', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const apiResponse = await response.json();
            console.log('Users fetched successfully');
            console.log(apiResponse);
        } else {
            console.error('Failed to fetch users');
        }
    }
    return (
        <div>
            
        </div>
    )
}
