"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { getAccessToken } from "@/services/getAccessToken";
import { logoutUser } from "@/app/(auth)/_actions/authActions";

const fetcher = async (url: string) => {
	const token = getAccessToken();
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	const res = await fetch(`${apiUrl}${url}`, {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
			"Content-Type": "application/json",
		},
	});

	if (res.status === 401 && token) {
		logoutUser();
		throw new Error("Session expired. Please log in again.");
	}

	if (!res.ok) {
		const errorData = await res.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to fetch data");
	}

	const result = await res.json();
	return result.data;
};

export const SWRProvider = ({ children }: { children: ReactNode }) => {
	return (
		<SWRConfig
			value={{
				fetcher,
				revalidateOnFocus: false,
				errorRetryCount: 2,
			}}
		>
			{children}
		</SWRConfig>
	);
};
