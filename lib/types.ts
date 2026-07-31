export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface User {
	id: string;
	name: string;
	email: string;
	role: Role;
	status: UserStatus;
	createdAt: string;
}

export interface Category {
	id: string;
	name: string;
}

export interface GearItem {
	id: string;
	title: string;
	description: string;
	brand: string;
	pricePerDay: number | string;
	quantity: number;
	isAvailable: boolean;
	images: string[];
	categoryId: string;
	category: Category;
	providerId: string;
	provider?: { id: string; name: string; email: string };
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
	meta?: PaginationMeta;
}
