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
import { Input } from "@/components/ui/input";
import { useAdminRentals } from "@/app/(dashboard)/_hooks/useAdminRentals";
import { useState, useMemo } from "react";
import {
	ListOrdered,
	Search,
	ChevronLeft,
	ChevronRight,
	Eye,
	ShieldAlert,
} from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderStatusBadge } from "@/app/(dashboard)/_components/customer/my_orders/OrderStatusBadge";
import { PaymentStatusBadge } from "@/app/(dashboard)/_components/customer/payment_history/PaymentStatusBadge";
import Link from "next/link";

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

const formatPrice = (price: number | string) => `$${Number(price).toFixed(2)}`;

interface AdminOrdersTableProps {
	limit?: number;
	enableSearchAndPagination?: boolean;
}

export const AdminOrdersTable = ({
	limit,
	enableSearchAndPagination = false,
}: AdminOrdersTableProps) => {
	const { rentals, isLoading, isError } = useAdminRentals();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const filteredRentals = useMemo(() => {
		if (!searchQuery.trim()) return rentals;
		const query = searchQuery.toLowerCase();
		return rentals.filter(
			(rental) =>
				rental.id.toLowerCase().includes(query) ||
				rental.gearItem?.title.toLowerCase().includes(query) ||
				rental.customer?.name.toLowerCase().includes(query) ||
				rental.customer?.email.toLowerCase().includes(query),
		);
	}, [rentals, searchQuery]);

	const paginatedRentals = useMemo(() => {
		if (limit) return filteredRentals.slice(0, limit);
		if (!enableSearchAndPagination) return filteredRentals;
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredRentals.slice(startIndex, startIndex + itemsPerPage);
	}, [
		filteredRentals,
		limit,
		currentPage,
		enableSearchAndPagination,
		itemsPerPage,
	]);

	const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);

	if (isLoading) return <AdminOrdersTableSkeleton />;

	if (isError)
		return (
			<EmptyState
				icon={ShieldAlert}
				title="Failed to load orders"
				description="There was an error fetching the platform orders. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);

	if (rentals.length === 0)
		return (
			<EmptyState
				icon={ListOrdered}
				title="No orders yet"
				description="There are currently no rental orders on the platform."
			/>
		);

	return (
		<>
			{enableSearchAndPagination && (
				<div className="flex items-center gap-4 mb-4">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search by order ID, gear, or customer..."
							className="pl-9"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1);
							}}
						/>
					</div>
					<p className="text-sm text-muted-foreground whitespace-nowrap">
						Showing {paginatedRentals.length} of{" "}
						{filteredRentals.length} orders
					</p>
				</div>
			)}
			<div className="rounded-md border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Gear Item</TableHead>
							<TableHead>Dates</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Payment</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedRentals.length > 0 ? (
							paginatedRentals.map((rental) => (
								<TableRow key={rental.id}>
									<TableCell className="font-medium font-mono text-xs">
										#{rental.id.slice(0, 8)}
									</TableCell>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-medium text-sm">
												{rental.customer?.name ||
													"Unknown"}
											</span>
											<span className="text-xs text-muted-foreground">
												{rental.customer?.email}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<span className="font-medium line-clamp-1">
											{rental.gearItem?.title ||
												"Unknown Gear"}
										</span>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatDate(rental.startDate)} <br />
										{formatDate(rental.endDate)}
									</TableCell>
									<TableCell>
										{formatPrice(rental.totalPrice)}
									</TableCell>
									<TableCell>
										<OrderStatusBadge
											status={rental.status}
										/>
									</TableCell>
									<TableCell>
										{rental.payment ? (
											<PaymentStatusBadge
												status={rental.payment.status}
											/>
										) : (
											<span className="text-xs text-muted-foreground">
												None
											</span>
										)}
									</TableCell>
									<TableCell className="text-right">
										<Link
											href={`/dashboard/my-orders/${rental.id}`}
											target="_blank"
										>
											<Button
												variant="ghost"
												size="icon-sm"
											>
												<Eye className="h-4 w-4" />
											</Button>
										</Link>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={8}
									className="h-24 text-center text-muted-foreground"
								>
									No orders match your search criteria.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{enableSearchAndPagination && totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-6">
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentPage((prev) => Math.max(prev - 1, 1))
						}
						disabled={currentPage <= 1}
					>
						<ChevronLeft className="h-4 w-4 mr-1" /> Previous
					</Button>
					<span className="text-sm text-muted-foreground px-4">
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentPage((prev) =>
								Math.min(prev + 1, totalPages),
							)
						}
						disabled={currentPage >= totalPages}
					>
						Next <ChevronRight className="h-4 w-4 ml-1" />
					</Button>
				</div>
			)}
		</>
	);
};

const AdminOrdersTableSkeleton = () => {
	return (
		<div className="rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>Gear Item</TableHead>
						<TableHead>Dates</TableHead>
						<TableHead>Total</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Payment</TableHead>
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
								<div className="flex flex-col gap-1">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-3 w-32" />
								</div>
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-32" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-24" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-16" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-20 rounded-full" />
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
};
