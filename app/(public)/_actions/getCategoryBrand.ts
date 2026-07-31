"use server";

const getCategories = async () => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	try {
		const res = await fetch(`${apiUrl}/categories`, {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch categories");
		}

		const result = await res.json();
		return result;
	} catch (error) {
		console.error("Error fetching categories:", error);
		return {
			success: false,
			message: "Failed to fetch categories",
			data: [],
		};
	}
};

export default getCategories;
