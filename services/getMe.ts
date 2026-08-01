"use server";

import { cookies } from "next/headers";

export async function getMe() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) return null;

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	try {
		const res = await fetch(`${apiUrl}/auth/me`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			cache: "no-store",
		});

		if (!res.ok) {
			if (res.status === 401) {
				cookieStore.delete("accessToken");
			}
			return null;
		}

		const result = await res.json();
		return result.data;
	} catch (error) {
		console.error("getMe error:", error);
		return null;
	}
}
