"use client";
import useSWR from "swr";
import { RentalOrder } from "@/lib/types";

export function useProviderOrders() {
	const { data, error, isLoading, mutate } =
		useSWR<RentalOrder[]>("/provider/orders");
	return {
		orders: data || [],
		isLoading,
		isError: error,
		mutate,
	};
}
