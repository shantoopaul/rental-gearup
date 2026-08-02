"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/app/(dashboard)/_config/sidebarMenuItems";
import { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { logoutUser } from "@/app/(auth)/_actions/authActions";
import { useTransition } from "react";

interface SidebarProps {
	userRole: Role;
	onLinkClick?: () => void;
}

export const Sidebar = ({ userRole, onLinkClick }: SidebarProps) => {
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const filteredItems = sidebarItems.filter((item) =>
		item.roles.includes(userRole),
	);

	const handleLogout = () => {
		startTransition(async () => {
			await logoutUser();
		});
	};

	return (
		<div className="flex h-full flex-col gap-4 py-4">
			<nav className="flex-1 space-y-1 px-3">
				{filteredItems.map((item) => {
					const isActive =
						pathname === item.href ||
						pathname.startsWith(item.href + "/");
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onLinkClick}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<item.icon className="h-4 w-4" />
							{item.title}
						</Link>
					);
				})}
			</nav>
			<div className="px-3 mt-auto flex flex-col gap-3">
				<Link href={"/"}>
					<Button
						variant="outline"
						className="w-full justify-start gap-3 text-primary hover:bg-primary/10 hover:text-primary"
					>
						<Home className="h-4 w-4" />
						Home Page
					</Button>
				</Link>
				<Button
					variant="outline"
					className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
					onClick={handleLogout}
					disabled={isPending}
				>
					<LogOut className="h-4 w-4" />
					{isPending ? "Logging out..." : "Log Out"}
				</Button>
			</div>
		</div>
	);
};
