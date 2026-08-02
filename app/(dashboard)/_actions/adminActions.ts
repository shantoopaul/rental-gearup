"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { UserStatus } from "@/lib/types";

export const updateUserStatus = async (userId: string, status: UserStatus) => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		return { success: false, message: "Unauthorized" };
	}

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	try {
		const res = await fetch(`${apiUrl}/admin/users/${userId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ status }),
			cache: "no-store",
		});

		const result = await res.json();

		if (!res.ok) {
			return {
				success: false,
				message: result.message || "Failed to update user status",
			};
		}

		revalidatePath("/admin-dashboard");
		revalidatePath("/admin-dashboard/users");

		return {
			success: true,
			message: `User ${status === "ACTIVE" ? "activated" : "suspended"} successfully`,
			data: result.data,
		};
	} catch (error) {
		console.error("Update user status error:", error);
		return {
			success: false,
			message: "An unexpected error occurred. Please try again.",
		};
	}
};
