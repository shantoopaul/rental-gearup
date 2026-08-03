"use client";

import { useAdminUsers } from "@/app/(dashboard)/_hooks/useAdminUsers";
import { useAdminGear } from "@/app/(dashboard)/_hooks/useAdminGear";
import { useAdminRentals } from "@/app/(dashboard)/_hooks/useAdminRentals";
import { StatsCard } from "@/components/shared/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Store, Package, ListOrdered, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminUsersTable } from "./AdminUsersTable";

const AdminDashboardOverview = () => {
	const {
		users,
		isLoading: isLoadingUsers,
		isError: isErrorUsers,
	} = useAdminUsers();
	const {
		gears,
		isLoading: isLoadingGears,
		isError: isErrorGears,
	} = useAdminGear();
	const {
		rentals,
		isLoading: isLoadingRentals,
		isError: isErrorRentals,
	} = useAdminRentals();

	const isLoading = isLoadingUsers || isLoadingGears || isLoadingRentals;
	const isError = isErrorUsers || isErrorGears || isErrorRentals;

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<Card key={i}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-4" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-16 mb-2" />
								<Skeleton className="h-3 w-24" />
							</CardContent>
						</Card>
					))}
				</div>
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (isError) {
		return (
			<EmptyState
				icon={ShieldAlert}
				title="Failed to load dashboard data"
				description="There was an error fetching platform statistics. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);
	}

	const totalUsers = users.length;
	const activeUsers = users.filter((u) => u.status === "ACTIVE").length;
	const providers = users.filter((u) => u.role === "PROVIDER").length;
	const customers = users.filter((u) => u.role === "CUSTOMER").length;

	const totalGear = gears.length;
	const availableGear = gears.filter((g) => g.isAvailable).length;

	const totalRentals = rentals.length;
	const activeRentals = rentals.filter((r) =>
		["PLACED", "CONFIRMED", "PAID", "PICKED_UP"].includes(r.status),
	).length;

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Total Users"
					value={totalUsers}
					icon={Users}
					description={`${activeUsers} active accounts`}
				/>
				<StatsCard
					title="Total Gear"
					value={totalGear}
					icon={Package}
					description={`${availableGear} available items`}
				/>
				<StatsCard
					title="Total Rentals"
					value={totalRentals}
					icon={ListOrdered}
					description={`${activeRentals} active rentals`}
				/>
				<StatsCard
					title="Providers"
					value={providers}
					icon={Store}
					description={`${customers} customers registered`}
				/>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold tracking-tight">
						Recent Users
					</h2>
					{users.length > 0 && (
						<Link href="/admin-dashboard/users">
							<Button variant="outline" size="sm">
								View All
							</Button>
						</Link>
					)}
				</div>
				{users.length > 0 ? (
					<AdminUsersTable limit={5} />
				) : (
					<EmptyState
						icon={Users}
						title="No users yet"
						description="When users register on the platform, they will appear here."
					/>
				)}
			</div>
		</div>
	);
};

export default AdminDashboardOverview;
