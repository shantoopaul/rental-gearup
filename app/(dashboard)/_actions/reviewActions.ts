"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const createReview = async (
	rentalOrderId: string,
	rating: number,
	comment: string,
) => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;
	if (!accessToken) return { success: false, message: "Unauthorized" };

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/reviews`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ rentalOrderId, rating, comment }),
			cache: "no-store",
		});
		const result = await res.json();
		if (!res.ok) {
			return {
				success: false,
				message: result.message || "Failed to submit review",
			};
		}
		revalidatePath("/dashboard/my-orders");
		revalidatePath("/gear");
		return { success: true, message: "Review submitted successfully" };
	} catch (error) {
		console.error("Create review error:", error);
		return { success: false, message: "An unexpected error occurred." };
	}
};
