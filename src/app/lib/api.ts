import { ICameras, ILocations, IUsers } from "../types";

export async function getUsers(token: string | undefined): Promise<IUsers> {
    // console.log(`${process.env.API_URL}/Users`);
    const res = await fetch(`${process.env.API_URL}/User`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    return res.json();
}

export async function getCamera(token: string | undefined): Promise<ICameras> {
    const res = await fetch(`${process.env.API_URL}/Camera`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch cameras");
    }
    return res.json();
}

export async function getLocation(token: string | undefined): Promise<ILocations> {
    const res = await fetch(`${process.env.API_URL}/Location`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch locations");
    }
    return res.json();
}

export async function getRecords(token:string | undefined) {
    const res = await fetch(`${process.env.API_URL}/Record`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch records");
    }
    return res.json();
}

export async function getDetailsRecords(token:string | undefined, recordId: string) {
    const res = await fetch(`${process.env.API_URL}/Record/${recordId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch record details");
    }
    return res.json();
}