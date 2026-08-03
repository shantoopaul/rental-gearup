"use client";

import useSWR from "swr";
import { GearItem } from "@/lib/types";

export const useAdminGear = () => {
	const { data, error, isLoading, mutate } =
		useSWR<GearItem[]>("/admin/gear");

	return {
		gears: data || [],
		isLoading,
		isError: error,
		mutate,
	};
};
