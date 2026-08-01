import { cookies } from "next/headers";

export async function setAccessToken(token: string) {
	const cookieStore = await cookies();
	cookieStore.set("accessToken", token, {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 60 * 15,
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
