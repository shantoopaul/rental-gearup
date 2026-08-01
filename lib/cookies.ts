import { cookies } from "next/headers";

export async function setAuthCookies(
	accessToken: string,
	refreshToken: string,
) {
	const cookieStore = await cookies();
	cookieStore.set("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 60 * 15,
		path: "/",
	});
	cookieStore.set("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 30,
		path: "/",
	});
}

export async function getAccessToken() {
	const cookieStore = await cookies();
	return cookieStore.get("accessToken")?.value;
}

export async function clearAccessToken() {
	const cookieStore = await cookies();
	cookieStore.delete("accessToken");
}
