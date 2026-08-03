"use client";

import useSWR from "swr";
import { RentalOrder } from "@/lib/types";

export const useAdminRentals = () => {
	const { data, error, isLoading, mutate } =
		useSWR<RentalOrder[]>("/admin/rentals");

	return {
		rentals: data || [],
		isLoading,
		isError: error,
		mutate,
	};
};
