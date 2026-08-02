"use client";

import useSWR from "swr";
import { Payment } from "@/lib/types";

export const useCustomerPayments = () => {
	const { data, error, isLoading, mutate } = useSWR<Payment[]>("/payments");

	return {
		payments: data || [],
		isLoading,
		isError: error,
		mutate,
	};
};
