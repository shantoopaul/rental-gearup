"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiResponse, RentalOrder } from "@/lib/types";

export const getRentalDetails = async (
	id: string,
): Promise<ApiResponse<RentalOrder | null>> => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;
	if (!accessToken) redirect("/login");

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/rentals/${id}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			cache: "no-store",
		});

		if (!res.ok) {
			if (res.status === 404) {
				return {
					success: false,
					message: "Order not found",
					data: null,
				};
			}
			throw new Error("Failed to fetch rental details");
		}

		const result = await res.json();
		return result;
	} catch (error) {
		console.error("Error fetching rental details:", error);
		return {
			success: false,
			message: "Failed to fetch rental details",
			data: null,
		};
	}
};
