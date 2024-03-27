import { IUsers } from "../types";

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
