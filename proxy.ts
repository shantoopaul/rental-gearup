import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "@/utils/jwt";

export const proxy = (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	let requiredRole: string | null = null;
	if (pathname.startsWith("/admin-dashboard")) {
		requiredRole = "ADMIN";
	} else if (pathname.startsWith("/provider-dashboard")) {
		requiredRole = "PROVIDER";
	} else if (pathname.startsWith("/dashboard")) {
		requiredRole = "CUSTOMER";
	}

	if (requiredRole) {
		const accessToken = request.cookies.get("accessToken")?.value;

		if (!accessToken) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(loginUrl);
		}

		const decoded = decodeToken(accessToken);
		if (!decoded || decoded.role !== requiredRole) {
			let fallback = "/dashboard";
			if (decoded?.role === "ADMIN") fallback = "/admin-dashboard";
			if (decoded?.role === "PROVIDER") fallback = "/provider-dashboard";

			return NextResponse.redirect(new URL(fallback, request.url));
		}
	}

	return NextResponse.next();
};

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
