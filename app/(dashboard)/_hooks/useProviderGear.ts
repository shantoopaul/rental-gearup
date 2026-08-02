"use client";

import useSWR from "swr";
import { GearItem } from "@/lib/types";

export const useProviderGear = () => {
	const { data, error, isLoading, mutate } =
		useSWR<GearItem[]>("/provider/gear");
	return {
		gears: data || [],
		isLoading,
		isError: error,
		mutate,
	};
};
