import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isProtectedRoute =
		pathname.startsWith("/dashboard") ||
		pathname.startsWith("/admin-dashboard") ||
		pathname.startsWith("/provider-dashboard");

	if (isProtectedRoute) {
		const accessToken = request.cookies.get("accessToken")?.value;

		if (!accessToken) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
