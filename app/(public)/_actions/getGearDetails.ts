"use server";

import { ApiResponse, GearItem } from "@/lib/types";

const getGearDetails = async (
	id: string,
): Promise<ApiResponse<GearItem | null>> => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/gear/${id}`, {
			cache: "no-store",
		});

		if (!res.ok) {
			if (res.status === 404) {
				return {
					success: false,
					message: "Gear not found",
					data: null,
				};
			}
			throw new Error("Failed to fetch gear details");
		}

		const result = await res.json();
		return result;
	} catch (error) {
		console.error("Error fetching gear details:", error);
		return {
			success: false,
			message: "Failed to fetch gear details",
			data: null,
		};
	}
};

export default getGearDetails;
