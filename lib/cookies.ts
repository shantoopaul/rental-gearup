import { cookies } from "next/headers";

export const setAuthCookies = async (
	accessToken: string,
	refreshToken: string,
) => {
	const cookieStore = await cookies();
	cookieStore.set("accessToken", accessToken, {
		httpOnly: false,
		secure: process.env.NODE_ENV === "development",
		sameSite: "lax",
		maxAge: 60 * 15,
		path: "/",
	});
	cookieStore.set("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "development",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 30,
		path: "/",
	});
};

export const getAccessToken = async () => {
	const cookieStore = await cookies();
	return cookieStore.get("accessToken")?.value;
};

export const clearAuthCookies = async () => {
	const cookieStore = await cookies();
	cookieStore.delete("accessToken");
	cookieStore.delete("refreshToken");
};
