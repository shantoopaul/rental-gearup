"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useCustomerOrders } from "@/app/(dashboard)/_hooks/useCustomerOrders";
import { Eye, CreditCard } from "lucide-react";
import Link from "next/link";

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

const formatPrice = (price: number | string) => `$${Number(price).toFixed(2)}`;

export function OrdersTable() {
	const { orders, isLoading, isError } = useCustomerOrders();

	if (isLoading) return <OrdersTableSkeleton />;
	if (isError)
		return (
			<div className="text-center py-10 text-destructive">
				Failed to load orders.
			</div>
		);
	if (orders.length === 0)
		return (
			<div className="text-center py-10 text-muted-foreground">
				No rental orders yet.
			</div>
		);

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Item</TableHead>
						<TableHead>Dates</TableHead>
						<TableHead>Total</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((order) => (
						<TableRow key={order.id}>
							<TableCell className="font-medium font-mono text-xs">
								#{order.id.slice(0, 8)}
							</TableCell>
							<TableCell>
								{order.gearItem?.title || "Unknown Gear"}
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								{formatDate(order.startDate)} -{" "}
								{formatDate(order.endDate)}
							</TableCell>
							<TableCell>
								{formatPrice(order.totalPrice)}
							</TableCell>
							<TableCell>
								<OrderStatusBadge status={order.status} />
							</TableCell>
							<TableCell className="text-right space-x-2">
								<Link href={`/dashboard/my-orders/${order.id}`}>
									<Button variant="ghost" size="icon-sm">
										<Eye className="h-4 w-4" />
									</Button>
								</Link>
								{order.status === "CONFIRMED" &&
									(!order.payment ||
										order.payment.status === "PENDING") && (
										<Link
											href={`/dashboard/my-orders/${order.id}/pay`}
										>
											<Button variant="outline" size="sm">
												<CreditCard className="h-4 w-4 mr-1" />{" "}
												Pay Now
											</Button>
										</Link>
									)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function OrdersTableSkeleton() {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Item</TableHead>
						<TableHead>Dates</TableHead>
						<TableHead>Total</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, i) => (
						<TableRow key={i}>
							<TableCell>
								<Skeleton className="h-4 w-20" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-32" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-40" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-16" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-20 rounded-full" />
							</TableCell>
							<TableCell className="text-right">
								<Skeleton className="h-8 w-8 ml-auto" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
