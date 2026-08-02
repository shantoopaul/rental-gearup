import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
	return NextResponse.redirect(new URL("/payment/cancel", request.url));
};
