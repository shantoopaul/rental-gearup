"use server";

import { RegisterInput, LoginInput } from "@/lib/validations/auth";

const registerUser = async (data: RegisterInput) => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/api/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
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
};

const loginUser = async (data: LoginInput) => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/api/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
			cache: "no-store",
		});
		const result = await res.json();

		if (!res.ok) {
			return {
				success: false,
				message: result.message || "Login failed",
				errors: result.errorDetails,
			};
		}

		return {
			success: true,
			message: "User logged in successfully",
			data: result.data,
		};
	} catch (error) {
		console.error("Login error:", error);
		return {
			success: false,
			message: "An unexpected error occurred. Please try again.",
		};
	}
};

export { registerUser, loginUser };
