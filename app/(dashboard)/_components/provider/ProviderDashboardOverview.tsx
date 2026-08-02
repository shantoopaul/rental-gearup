"use client";

import { useProviderGear } from "@/app/(dashboard)/_hooks/useProviderGear";
import { useProviderOrders } from "@/app/(dashboard)/_hooks/useProviderOrders";
import { StatsCard } from "@/components/shared/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ListOrdered, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProviderOrdersTable } from "./my_orders/ProviderOrdersTable";

const ProviderDashboardOverview = () => {
	const {
		gears,
		isLoading: isLoadingGear,
		isError: isErrorGear,
	} = useProviderGear();
	const {
		orders,
		isLoading: isLoadingOrders,
		isError: isErrorOrders,
	} = useProviderOrders();

	const isLoading = isLoadingGear || isLoadingOrders;
	const isError = isErrorGear || isErrorOrders;

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
				icon={Package}
				title="Failed to load dashboard data"
				description="There was an error fetching your inventory or orders. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);
	}

	const activeRentals = orders.filter((o) =>
		["PLACED", "CONFIRMED", "PAID", "PICKED_UP"].includes(o.status),
	);

	const pendingOrders = orders.filter((o) => o.status === "PLACED");

	const totalRevenue = orders
		.filter((o) => ["PAID", "PICKED_UP", "RETURNED"].includes(o.status))
		.reduce((sum, o) => sum + Number(o.totalPrice), 0);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Total Gear"
					value={gears.length}
					icon={Package}
					description="Items in your inventory"
				/>
				<StatsCard
					title="Active Rentals"
					value={activeRentals.length}
					icon={Clock}
					description="Currently ongoing rentals"
				/>
				<StatsCard
					title="Pending Orders"
					value={pendingOrders.length}
					icon={ListOrdered}
					description="Awaiting your confirmation"
				/>
				<StatsCard
					title="Total Revenue"
					value={`$${totalRevenue.toFixed(2)}`}
					icon={DollarSign}
					description="From paid & completed orders"
				/>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold tracking-tight">
						Recent Incoming Orders
					</h2>
					{orders.length > 0 && (
						<Link href="/provider-dashboard/my-orders">
							<Button variant="outline" size="sm">
								View All
							</Button>
						</Link>
					)}
				</div>
				{orders.length > 0 ? (
					<ProviderOrdersTable />
				) : (
					<EmptyState
						icon={ListOrdered}
						title="No incoming orders"
						description="When customers rent your gear, their orders will appear here for you to manage."
						action={
							<Link href="/provider-dashboard/add-gear">
								<Button>Add Your First Gear</Button>
							</Link>
						}
					/>
				)}
			</div>
		</div>
	);
};

export default ProviderDashboardOverview;
