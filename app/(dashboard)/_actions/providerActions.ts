"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { RentalStatus } from "@/lib/types";

export const updateOrderStatus = async (
	orderId: string,
	status: RentalStatus,
) => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		return { success: false, message: "Unauthorized" };
	}

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	try {
		const res = await fetch(`${apiUrl}/provider/orders/${orderId}`, {
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
				message: result.message || "Failed to update order status",
			};
		}

		revalidatePath("/provider-dashboard/my-orders");
		return {
			success: true,
			message: "Order status updated successfully",
			data: result.data,
		};
	} catch (error) {
		console.error("Update order status error:", error);
		return {
			success: false,
			message: "An unexpected error occurred. Please try again.",
		};
	}
};
