"use client";

import { useCustomerOrders } from "@/app/(dashboard)/_hooks/useCustomerOrders";
import { StatsCard } from "@/components/shared/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ShoppingBag,
	Clock,
	CheckCircle,
	DollarSign,
	ListOrdered,
} from "lucide-react";
import { OrdersTable } from "./my_orders/OrdersTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const DashboardOverview = () => {
	const { orders, isLoading, isError } = useCustomerOrders();

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
				icon={ListOrdered}
				title="Failed to load dashboard data"
				description="There was an error fetching your rental statistics. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);
	}

	const activeOrders = orders.filter((o) =>
		["PLACED", "CONFIRMED", "PAID", "PICKED_UP"].includes(o.status),
	);
	const completedOrders = orders.filter((o) => o.status === "RETURNED");

	const totalSpent = orders
		.filter((o) => ["PAID", "PICKED_UP", "RETURNED"].includes(o.status))
		.reduce((sum, o) => sum + Number(o.totalPrice), 0);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Active Rentals"
					value={activeOrders.length}
					icon={Clock}
					description="Currently ongoing rentals"
				/>
				<StatsCard
					title="Completed"
					value={completedOrders.length}
					icon={CheckCircle}
					description="Successfully returned"
				/>
				<StatsCard
					title="Total Orders"
					value={orders.length}
					icon={ShoppingBag}
					description="All time rentals"
				/>
				<StatsCard
					title="Total Spent"
					value={`$${totalSpent.toFixed(2)}`}
					icon={DollarSign}
					description="Lifetime rental costs"
				/>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold tracking-tight">
						Recent Orders
					</h2>
					{orders.length > 0 && (
						<Link href="/dashboard/my-orders">
							<Button variant="outline" size="sm">
								View All
							</Button>
						</Link>
					)}
				</div>
				{orders.length > 0 ? (
					<OrdersTable />
				) : (
					<EmptyState
						icon={ShoppingBag}
						title="No rentals yet"
						description="Start your adventure by browsing our gear collection and booking your first rental."
						action={
							<Link href="/gear">
								<Button>Browse Gear</Button>
							</Link>
						}
					/>
				)}
			</div>
		</div>
	);
};

export default DashboardOverview;
