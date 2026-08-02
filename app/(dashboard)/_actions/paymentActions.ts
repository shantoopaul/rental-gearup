"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const initiatePayment = async (rentalOrderId: string) => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		redirect("/login");
	}

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	let checkoutUrl: string | null = null;

	try {
		const res = await fetch(`${apiUrl}/payments/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ rentalOrderId }),
			cache: "no-store",
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || "Failed to create payment session");
		}

		const result = await res.json();
		checkoutUrl = result.data?.checkoutUrl;

		if (!checkoutUrl) {
			throw new Error("No checkout URL returned from payment provider");
		}
	} catch (error) {
		console.error("Payment initiation error:", error);
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("An unexpected error occurred");
	}

	redirect(checkoutUrl);
};
