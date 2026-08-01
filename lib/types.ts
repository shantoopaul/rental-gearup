export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type RentalStatus =
	| "PLACED"
	| "CONFIRMED"
	| "PAID"
	| "PICKED_UP"
	| "RETURNED"
	| "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface RentalOrder {
	id: string;
	startDate: string;
	endDate: string;
	quantity: number;
	totalPrice: number | string;
	status: RentalStatus;
	createdAt: string;
	updatedAt: string;
	customerId: string;
	gearItemId: string;
	gearItem: GearItem;
	payment?: Payment;
}

export interface Payment {
	id: string;
	transactionId: string;
	amount: number | string;
	method: "STRIPE" | "SSLCOMMERZ";
	status: PaymentStatus;
	paidAt?: string;
	createdAt: string;
	updatedAt: string;
	rentalOrderId: string;
	rentalOrder?: RentalOrder;
}

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

export interface Review {
	id: string;
	rating: number;
	comment?: string;
	createdAt: string;
	customer: { id: string; name: string };
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
	reviews?: Review[];
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
