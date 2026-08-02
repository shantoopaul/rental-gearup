"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const createRentalAndPay = async (formData: FormData) => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		redirect("/login?callbackUrl=/gear");
	}

	const gearItemId = formData.get("gearItemId") as string;
	const startDate = formData.get("startDate") as string;
	const endDate = formData.get("endDate") as string;
	const quantity = Number(formData.get("quantity") || 1);

	const startDateISO = new Date(startDate).toISOString();
	const endDateISO = new Date(endDate).toISOString();

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	try {
		const rentalRes = await fetch(`${apiUrl}/rentals`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				gearItemId,
				startDate: startDateISO,
				endDate: endDateISO,
				quantity,
			}),
		});

		if (!rentalRes.ok) {
			const err = await rentalRes.json();
			throw new Error(err.message || "Failed to create rental order");
		}

		const rentalData = await rentalRes.json();
		const rentalOrderId = rentalData.data.id;

		const paymentRes = await fetch(`${apiUrl}/payments/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ rentalOrderId }),
		});

		if (!paymentRes.ok) {
			const err = await paymentRes.json();
			throw new Error(err.message || "Failed to create payment session");
		}

		const paymentData = await paymentRes.json();
		const checkoutUrl = paymentData.data.checkoutUrl;

		if (checkoutUrl) {
			redirect(checkoutUrl);
		} else {
			throw new Error("No checkout URL returned from payment provider");
		}
	} catch (error) {
		console.error("Rental/Payment error:", error);
		if (error instanceof Error) {
			throw new Error(error.message || "An unexpected error occurred");
		}
	}
};
