"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { useCustomerPayments } from "@/app/(dashboard)/_hooks/useCustomerPayments";
import { CreditCard } from "lucide-react";

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const formatPrice = (price: number | string) => `$${Number(price).toFixed(2)}`;

export function PaymentsTable() {
	const { payments, isLoading, isError } = useCustomerPayments();

	if (isLoading) return <PaymentsTableSkeleton />;

	if (isError)
		return (
			<div className="text-center py-10 text-destructive">
				Failed to load payment history.
			</div>
		);

	if (payments.length === 0)
		return (
			<div className="text-center py-10 text-muted-foreground">
				No payment history found.
			</div>
		);

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Transaction ID</TableHead>
						<TableHead>Gear Item</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Method</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{payments.map((payment) => (
						<TableRow key={payment.id}>
							<TableCell className="font-medium font-mono text-xs">
								{payment.transactionId.slice(0, 12)}...
							</TableCell>
							<TableCell>
								{payment.rentalOrder?.gearItem?.title ||
									"Unknown Gear"}
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								{formatDate(
									payment.paidAt || payment.createdAt,
								)}
							</TableCell>
							<TableCell>{formatPrice(payment.amount)}</TableCell>
							<TableCell className="flex items-center gap-2">
								<CreditCard className="h-4 w-4 text-muted-foreground" />
								<span className="capitalize">
									{payment.method.toLowerCase()}
								</span>
							</TableCell>
							<TableCell>
								<PaymentStatusBadge status={payment.status} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function PaymentsTableSkeleton() {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Transaction ID</TableHead>
						<TableHead>Gear Item</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Method</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, i) => (
						<TableRow key={i}>
							<TableCell>
								<Skeleton className="h-4 w-24" />
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
								<Skeleton className="h-4 w-20" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-20 rounded-full" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
