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
import { OrderStatusBadge } from "@/app/(dashboard)/_components/customer/my_orders/OrderStatusBadge";
import { useProviderOrders } from "@/app/(dashboard)/_hooks/useProviderOrders";
import { updateOrderStatus } from "@/app/(dashboard)/_actions/providerActions";
import { toast } from "sonner";
import { useTransition } from "react";
import { CheckCircle, Package, Truck, ListOrdered } from "lucide-react";
import { RentalStatus } from "@/lib/types";
import { EmptyState } from "@/components/shared/EmptyState";

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

const formatPrice = (price: number | string) => `$${Number(price).toFixed(2)}`;

export function ProviderOrdersTable() {
	const { orders, isLoading, isError, mutate } = useProviderOrders();
	const [isPending, startTransition] = useTransition();

	const handleStatusUpdate = async (
		orderId: string,
		newStatus: RentalStatus,
	) => {
		startTransition(async () => {
			const result = await updateOrderStatus(orderId, newStatus);
			if (result.success) {
				toast.success(result.message);
				mutate(); // Optimistically refresh SWR cache
			} else {
				toast.error(result.message);
			}
		});
	};

	if (isLoading) return <ProviderOrdersTableSkeleton />;

	if (isError)
		return (
			<EmptyState
				icon={ListOrdered}
				title="Failed to load orders"
				description="There was an error fetching your incoming orders. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);

	if (orders.length === 0)
		return (
			<EmptyState
				icon={ListOrdered}
				title="No incoming orders"
				description="When customers rent your gear, their orders will appear here for you to manage."
			/>
		);

	return (
		<div className="rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>Gear Item</TableHead>
						<TableHead>Dates</TableHead>
						<TableHead>Qty</TableHead>
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
								<div className="flex flex-col">
									<span className="font-medium">
										{order.customer?.name || "Unknown"}
									</span>
									<span className="text-xs text-muted-foreground">
										{order.customer?.email}
									</span>
								</div>
							</TableCell>
							<TableCell>
								{order.gearItem?.title || "Unknown Gear"}
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								{formatDate(order.startDate)} <br />{" "}
								{formatDate(order.endDate)}
							</TableCell>
							<TableCell>{order.quantity}</TableCell>
							<TableCell>
								{formatPrice(order.totalPrice)}
							</TableCell>
							<TableCell>
								<OrderStatusBadge status={order.status} />
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-2">
									{order.status === "PLACED" && (
										<Button
											size="sm"
											variant="outline"
											disabled={isPending}
											onClick={() =>
												handleStatusUpdate(
													order.id,
													"CONFIRMED",
												)
											}
										>
											<CheckCircle className="h-4 w-4 mr-1" />{" "}
											Confirm
										</Button>
									)}
									{order.status === "PAID" && (
										<Button
											size="sm"
											variant="outline"
											disabled={isPending}
											onClick={() =>
												handleStatusUpdate(
													order.id,
													"PICKED_UP",
												)
											}
										>
											<Package className="h-4 w-4 mr-1" />{" "}
											Picked Up
										</Button>
									)}
									{order.status === "PICKED_UP" && (
										<Button
											size="sm"
											variant="outline"
											disabled={isPending}
											onClick={() =>
												handleStatusUpdate(
													order.id,
													"RETURNED",
												)
											}
										>
											<Truck className="h-4 w-4 mr-1" />{" "}
											Returned
										</Button>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function ProviderOrdersTableSkeleton() {
	return (
		<div className="rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>Gear Item</TableHead>
						<TableHead>Dates</TableHead>
						<TableHead>Qty</TableHead>
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
								<Skeleton className="h-4 w-32" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-40" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-8" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-16" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-20 rounded-full" />
							</TableCell>
							<TableCell className="text-right">
								<Skeleton className="h-8 w-24 ml-auto" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
