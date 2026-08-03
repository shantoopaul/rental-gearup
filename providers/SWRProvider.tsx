"use client";
import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { getAccessToken } from "@/services/getAccessToken";
import {
	refreshAccessToken,
	expireSession,
} from "@/app/(auth)/_actions/authActions";
import { RefreshResult } from "@/lib/types";

let refreshPromise: Promise<RefreshResult> | null = null;

const fetcher = async (url: string) => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	const doFetch = async (bearerToken: string | null) => {
		return fetch(`${apiUrl}${url}`, {
			headers: {
				Authorization: bearerToken ? `Bearer ${bearerToken}` : "",
				"Content-Type": "application/json",
			},
		});
	};

	const token = getAccessToken();
	let res = await doFetch(token);

	if (res.status === 401 && token) {
		if (!refreshPromise) {
			refreshPromise = refreshAccessToken();
		}
		const refreshResult = await refreshPromise;
		refreshPromise = null;

		if (refreshResult.success && refreshResult.accessToken) {
			res = await doFetch(refreshResult.accessToken);
		} else {
			await expireSession();
			if (typeof window !== "undefined") {
				window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
			}
			throw new Error("Session expired. Please log in again.");
		}
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
