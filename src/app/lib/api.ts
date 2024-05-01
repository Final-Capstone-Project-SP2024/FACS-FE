import { ICameras, ILocations, IRecords, IRecordsDetail, IUsers } from "../types";

export async function getUsers(token: string | undefined, page : number = 1, pageSize : number = 10): Promise<IUsers> {
    const res = await fetch(`${process.env.API_URL}/User?Page=${page}&PageSize=${pageSize}`, {
    // const res = await fetch(`${process.env.API_URL}/User`, {
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

export async function getTop5Records(token:string | undefined) {
    const res = await fetch(`${process.env.API_URL}/Record?Page=1&PageSize=5&SortType=1&ColName=recordTime&FromDate=2020-1-1&ToDate=2030-1-1`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch records");
    }
    return res.json();
}

export async function getRecordsDetails(token:string | undefined, recordId: string){
    console.log(`${process.env.API_URL}/Record/${recordId}`);
    const res = await fetch(`${process.env.API_URL}/Record/${recordId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Mày Non");
    }
    return res.json();
}