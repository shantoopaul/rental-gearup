"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { GearInput } from "@/lib/validations/gear";

const getHeaders = async () => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${accessToken}`,
	};
};

export const createGear = async (data: GearInput) => {
	const headers = await getHeaders();
	if (!headers.Authorization)
		return { success: false, message: "Unauthorized" };

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/provider/gear`, {
			method: "POST",
			headers,
			body: JSON.stringify(data),
			cache: "no-store",
		});
		const result = await res.json();
		if (!res.ok)
			return {
				success: false,
				message: result.message || "Failed to create gear",
			};

		revalidatePath("/provider-dashboard/my-gears");
		revalidatePath("/gear");
		revalidatePath("/");
		return {
			success: true,
			message: "Gear created successfully",
			data: result.data,
		};
	} catch (error) {
		console.error("Create gear error:", error);
		return { success: false, message: "An unexpected error occurred." };
	}
};

export const updateGearStock = async (id: string, quantity: number) => {
	const headers = await getHeaders();
	if (!headers.Authorization)
		return { success: false, message: "Unauthorized" };

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/provider/gear/${id}`, {
			method: "PUT",
			headers,
			body: JSON.stringify({ quantity }),
			cache: "no-store",
		});
		const result = await res.json();
		if (!res.ok)
			return {
				success: false,
				message: result.message || "Failed to update stock",
			};

		revalidatePath("/provider-dashboard/my-gears");
		revalidatePath(`/gear/${id}`);
		revalidatePath("/gear");
		revalidatePath("/");
		return { success: true, message: "Stock updated successfully" };
	} catch (error) {
		console.error(error);
		return { success: false, message: "An unexpected error occurred." };
	}
};

export const deleteGear = async (id: string) => {
	const headers = await getHeaders();
	if (!headers.Authorization)
		return { success: false, message: "Unauthorized" };

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/provider/gear/${id}`, {
			method: "DELETE",
			headers,
			cache: "no-store",
		});
		const result = await res.json();
		if (!res.ok)
			return {
				success: false,
				message: result.message || "Failed to delete gear",
			};

		revalidatePath("/provider-dashboard/my-gears");
		revalidatePath("/gear");
		revalidatePath("/");
		return { success: true, message: "Gear removed successfully" };
	} catch (error) {
		console.error(error);
		return { success: false, message: "An unexpected error occurred." };
	}
};

export const toggleGearAvailability = async (
	id: string,
	isAvailable: boolean,
) => {
	const headers = await getHeaders();
	if (!headers.Authorization)
		return { success: false, message: "Unauthorized" };

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/provider/gear/${id}`, {
			method: "PUT",
			headers,
			body: JSON.stringify({ isAvailable: !isAvailable }),
			cache: "no-store",
		});
		const result = await res.json();
		if (!res.ok)
			return {
				success: false,
				message: result.message || "Failed to update gear",
			};

		revalidatePath("/provider-dashboard/my-gears");
		revalidatePath(`/gear/${id}`);
		revalidatePath("/gear");
		revalidatePath("/");
		return { success: true, message: "Gear availability updated" };
	} catch (error) {
		console.error(error);
		return { success: false, message: "An unexpected error occurred." };
	}
};
