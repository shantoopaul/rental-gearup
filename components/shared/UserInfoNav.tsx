"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Calendar, Shield, LayoutDashboard } from "lucide-react";
import { useTransition } from "react";
import { logoutUser } from "@/app/(auth)/_actions/authActions";
import { User as UserType } from "@/lib/types";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

interface UserInfoNavProps {
	user: UserType;
}

export const UserInfoNav = ({ user }: UserInfoNavProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleLogout = () =>
		startTransition(async () => {
			await logoutUser();
		});

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			)
				setIsOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const dashboardHref =
		user.role === "ADMIN"
			? "/admin-dashboard"
			: user.role === "PROVIDER"
				? "/provider-dashboard"
				: "/dashboard";

	return (
		<>
			<div className="relative" ref={dropdownRef}>
				<Button
					variant="ghost"
					className="relative h-8 w-8 rounded-full"
					onClick={() => setIsOpen(!isOpen)}
				>
					<Avatar className="h-8 w-8">
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
				{isOpen && (
					<div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95">
						<div className="px-2 py-1.5">
							<p className="text-sm font-medium leading-none">
								{user.name}
							</p>
							<p className="text-xs leading-none text-muted-foreground mt-1">
								{user.email}
							</p>
							<p className="text-xs font-semibold text-primary mt-1 uppercase">
								{user.role}
							</p>
						</div>
						<div className="h-px my-1 -mx-1 bg-border" />

						{/* Dashboard Link */}
						<Link
							href={dashboardHref}
							className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
							onClick={() => setIsOpen(false)}
						>
							<LayoutDashboard className="mr-2 h-4 w-4" />
							<span>Dashboard</span>
						</Link>

						<button
							className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
							onClick={() => {
								setIsOpen(false);
								setIsProfileOpen(true);
							}}
						>
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</button>
						<div className="h-px my-1 -mx-1 bg-border" />
						<button
							className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-destructive focus:bg-destructive/10 focus:text-destructive"
							onClick={handleLogout}
							disabled={isPending}
						>
							<LogOut className="mr-2 h-4 w-4" />
							<span>
								{isPending ? "Logging out..." : "Log out"}
							</span>
						</button>
					</div>
				)}
			</div>

			{/* Profile Dialog */}
			<Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Profile Information</DialogTitle>
						<DialogDescription>
							View your account details and membership
							information.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-6 py-4">
						<div className="flex items-center gap-4">
							<Avatar className="h-16 w-16">
								<AvatarFallback className="text-lg">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-lg font-semibold leading-none">
									{user.name}
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									{user.email}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground flex items-center gap-1.5">
									<Shield className="h-3.5 w-3.5" /> Role
								</p>
								<p className="text-sm font-medium capitalize">
									{user.role.toLowerCase()}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground flex items-center gap-1.5">
									<Calendar className="h-3.5 w-3.5" /> Member
									Since
								</p>
								<p className="text-sm font-medium">
									{new Date(
										user.createdAt,
									).toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})}
								</p>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
