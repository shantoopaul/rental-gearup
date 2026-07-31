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
