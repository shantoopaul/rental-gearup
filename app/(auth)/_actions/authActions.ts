"use server";

import { RegisterInput, LoginInput } from "@/lib/validations/auth";
import { setAccessToken, clearAccessToken } from "@/lib/cookies";
import { redirect } from "next/navigation";

const registerUser = async (data: RegisterInput) => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/auth/register`, {
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
		const res = await fetch(`${apiUrl}/auth/login`, {
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

		if (result.data?.accessToken) {
			await setAccessToken(result.data.accessToken);

			// Redirect based on role
			const role = result.data.user.role;
			if (role === "ADMIN") {
				redirect("/admin-dashboard");
			} else if (role === "PROVIDER") {
				redirect("/provider-dashboard");
			} else {
				redirect("/dashboard");
			}
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

const logoutUser = async () => {
	await clearAccessToken();
	redirect("/auth/login");
};

export { registerUser, loginUser, logoutUser };
