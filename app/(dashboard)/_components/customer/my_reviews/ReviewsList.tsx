"use client";

import { useCustomerOrders } from "@/app/(dashboard)/_hooks/useCustomerOrders";
import { EmptyState } from "@/components/shared/EmptyState";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "./ReviewCard";
import { Skeleton } from "@/components/ui/skeleton";

export const ReviewsList = () => {
	const { orders, isLoading, isError } = useCustomerOrders();

	if (isLoading) return <ReviewsListSkeleton />;

	if (isError) {
		return (
			<EmptyState
				icon={MessageSquare}
				title="Failed to load reviews"
				description="There was an error fetching your reviews. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);
	}

	const reviewedOrders = orders.filter((order) => order.reviews);

	if (reviewedOrders.length === 0) {
		return (
			<EmptyState
				icon={MessageSquare}
				title="No reviews yet"
				description="You haven't left any reviews yet. Rent some gear and share your experience!"
				action={
					<Link href="/gear">
						<Button>Browse Gear</Button>
					</Link>
				}
			/>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{reviewedOrders.map((order) => (
				<ReviewCard key={order.id} order={order} />
			))}
		</div>
	);
};

const ReviewsListSkeleton = () => {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="rounded-xl border bg-card p-6 space-y-4"
				>
					<div className="flex items-center gap-4">
						<Skeleton className="h-16 w-16 rounded-lg" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-3 w-1/2" />
						</div>
					</div>
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</div>
			))}
		</div>
	);
};
