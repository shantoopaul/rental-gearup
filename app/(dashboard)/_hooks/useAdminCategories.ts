"use client";

import useSWR from "swr";
import { Category } from "@/lib/types";

export const useAdminCategories = () => {
	const { data, error, isLoading, mutate } =
		useSWR<Category[]>("/categories");
	return {
		categories: data || [],
		isLoading,
		isError: error,
		mutate,
	};
};
