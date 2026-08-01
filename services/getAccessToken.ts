"use client";

export const getAccessToken = () => {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(/(^| )accessToken=([^;]+)/);
	return match ? match[2] : null;
};
