"use client";

import useSWR from "swr";
import { RentalOrder } from "@/lib/types";

export const useCustomerOrders = () => {
	const { data, error, isLoading, mutate } =
		useSWR<RentalOrder[]>("/rentals");

	return {
		orders: data || [],
		isLoading,
		isError: error,
		mutate,
	};
};
