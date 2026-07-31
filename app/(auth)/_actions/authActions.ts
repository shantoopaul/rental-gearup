"use server";

import { RegisterInput } from "@/lib/validations/auth";

export async function registerUser(data: RegisterInput) {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	try {
		const res = await fetch(`${apiUrl}/api/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			cache: "no-store",
		});

		const result = await res.json();

		if (!res.ok) {
			return {
				success: false,
				message: result.message || "Registration failed",
				errors: result.errorDetails,
			};
		}

		return {
			success: true,
			message: "User registered successfully. Please log in.",
			data: result.data,
		};
	} catch (error) {
		console.error("Registration error:", error);
		return {
			success: false,
			message: "An unexpected error occurred. Please try again.",
		};
	}
}
