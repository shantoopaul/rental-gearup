"use server";

const getGears = async () => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	const query = new URLSearchParams();

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
