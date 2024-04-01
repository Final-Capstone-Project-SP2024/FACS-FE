import React from 'react'

type camera = {
    id: string;
    cameraName: string;
    cameraDestination: string;
    status: string;
}

const handleGetCamera = async (token: string | undefined) => {
    const response = await fetch('https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(response);
}

export default function GetCamera({ id, cameraName, cameraDestination, status }: camera) {
    return (
        <>
            <td className="border px-4 py-2">{cameraName}</td>
            <td className="border px-4 py-2">{cameraDestination}</td>
            <td className="border px-4 py-2">{status}</td>
        </>
    )
}
