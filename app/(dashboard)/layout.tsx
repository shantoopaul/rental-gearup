import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getMe } from "@/services/getMe";
import { Sidebar } from "@/components/shared/Sidebar";
import { UserInfoNav } from "@/components/shared/UserInfoNav";
import { MobileMenuButtons } from "@/components/shared/MobileMenuButtons";
import { Toaster } from "@/components/ui/sonner";
import { decodeToken } from "@/utils/jwt";
import { Role } from "@/lib/types";
import { SWRProvider } from "@/providers/SWRProvider";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) redirect("/login");

	const decoded = decodeToken(accessToken);
	if (!decoded) redirect("/login");

	const user = await getMe();
	if (!user) redirect("/login");

	const userRole = decoded.role as Role;

	return (
		<SWRProvider>
			<div className="flex min-h-screen flex-col bg-background">
				<Toaster />

				{/* Mobile Header */}
				<header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 lg:hidden">
					<MobileMenuButtons userRole={userRole} />
					<div className="flex-1" />
					<UserInfoNav user={user} />
				</header>

				<div className="flex flex-1">
					{/* Desktop Sidebar */}
					<aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-card sticky top-0 h-screen">
						<div className="flex h-16 items-center border-b px-6">
							<h2 className="text-lg font-semibold text-primary">
								GearUp Dashboard
							</h2>
						</div>
						<Sidebar userRole={userRole} />
					</aside>

					{/* Main Content Area */}
					<main className="flex-1 overflow-y-auto bg-muted/30">
						<div className="hidden lg:flex h-16 items-center justify-end border-b bg-background px-8 sticky top-0 z-20">
							<UserInfoNav user={user} />
						</div>
						<div className="p-4 md:p-6 lg:p-8">{children}</div>
					</main>
				</div>
			</div>
		</SWRProvider>
	);
}
