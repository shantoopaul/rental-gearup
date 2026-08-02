"use client";

import useSWR from "swr";
import { User } from "@/lib/types";

export const useAdminUsers = () => {
	const { data, error, isLoading, mutate } = useSWR<User[]>("/admin/users");

	return {
		users: data || [],
		isLoading,
		isError: error,
		mutate,
	};
};
