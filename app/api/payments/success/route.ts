import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (request: NextRequest) => {
	const searchParams = request.nextUrl.searchParams;
	const sessionId = searchParams.get("session_id");

	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!sessionId) {
		return NextResponse.redirect(new URL("/payment/cancel", request.url));
	}

	if (accessToken) {
		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;
			await fetch(`${apiUrl}/payments/confirm`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ sessionId }),
			});
		} catch (error) {
			console.error("Failed to confirm payment:", error);
		}
	}

	return NextResponse.redirect(new URL("/payment/success", request.url));
};
