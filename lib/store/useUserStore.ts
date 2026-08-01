import { create } from "zustand";

export interface User {
	id: string;
	name: string;
	email: string;
	role: "CUSTOMER" | "PROVIDER" | "ADMIN";
	status: "ACTIVE" | "SUSPENDED";
}

interface UserStore {
	user: User | null;
	setUser: (user: User | null) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
}));
