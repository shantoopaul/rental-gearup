"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { categorySchema } from "@/lib/validations/category";

export const createCategory = async (name: string) => {
	const validation = categorySchema.safeParse({ name });
	if (!validation.success) {
		return {
			success: false,
			message: "Invalid input",
			errors: validation.error.flatten().fieldErrors,
		};
	}

	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;
	if (!accessToken) return { success: false, message: "Unauthorized" };

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/categories`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ name: validation.data.name }),
			cache: "no-store",
		});
		const result = await res.json();
		if (!res.ok) {
			return {
				success: false,
				message: result.message || "Failed to create category",
				errors: result.errorDetails,
			};
		}
		revalidatePath("/admin-dashboard/categories");
		revalidatePath("/provider-dashboard/add-gear");
		revalidatePath("/gear");
		return {
			success: true,
			message: "Category created successfully",
			data: result.data,
		};
	} catch (error) {
		console.error("Create category error:", error);
		return { success: false, message: "An unexpected error occurred." };
	}
};

export const updateCategory = async (id: string, name: string) => {
	const validation = categorySchema.safeParse({ name });
	if (!validation.success) {
		return {
			success: false,
			message: "Invalid input",
			errors: validation.error.flatten().fieldErrors,
		};
	}

	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;
	if (!accessToken) return { success: false, message: "Unauthorized" };

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/categories/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ name: validation.data.name }),
			cache: "no-store",
		});
		const result = await res.json();
		if (!res.ok) {
			return {
				success: false,
				message: result.message || "Failed to update category",
				errors: result.errorDetails,
			};
		}
		revalidatePath("/admin-dashboard/categories");
		revalidatePath("/provider-dashboard/add-gear");
		revalidatePath("/gear");
		return {
			success: true,
			message: "Category updated successfully",
			data: result.data,
		};
	} catch (error) {
		console.error("Update category error:", error);
		return { success: false, message: "An unexpected error occurred." };
	}
};

export const deleteCategory = async (id: string) => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;
	if (!accessToken) return { success: false, message: "Unauthorized" };

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/categories/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			cache: "no-store",
		});
		const result = await res.json();
		if (!res.ok) {
			return {
				success: false,
				message: result.message || "Failed to delete category",
			};
		}
		revalidatePath("/admin-dashboard/categories");
		revalidatePath("/provider-dashboard/add-gear");
		revalidatePath("/gear");
		return { success: true, message: "Category deleted successfully" };
	} catch (error) {
		console.error("Delete category error:", error);
		return { success: false, message: "An unexpected error occurred." };
	}
};
