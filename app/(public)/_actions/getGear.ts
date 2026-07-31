"use server";

import { ApiResponse, GearItem, PaginationMeta } from "@/lib/types";

export interface GearFilters {
	category?: string;
	brand?: string;
	minPrice?: string;
	maxPrice?: string;
	search?: string;
	page?: string;
	limit?: string;
	sortBy?: string;
	sortOrder?: string;
}

const getGears = async (
	filters: GearFilters,
): Promise<ApiResponse<GearItem[]> & { meta?: PaginationMeta }> => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	const query = new URLSearchParams();

	Object.entries(filters).forEach(([key, value]) => {
		if (value) query.append(key, value);
	});

	try {
		const res = await fetch(`${apiUrl}/gear?${query.toString()}`, {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch gears");
		}

		const result = await res.json();
		return result;
	} catch (error) {
		console.error("Error fetching gears:", error);
		return { success: false, message: "Failed to fetch gears", data: [] };
	}
};

export default getGears;
