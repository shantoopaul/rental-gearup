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
import { useProviderGear } from "@/app/(dashboard)/_hooks/useProviderGear";
import { EmptyState } from "@/components/shared/EmptyState";
import { Package, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GearRowActions } from "./GearRowActions";

const formatPrice = (price: number | string) => `$${Number(price).toFixed(2)}`;

export const ProviderGearTable = () => {
	const { gears, isLoading, isError } = useProviderGear();

	if (isLoading) return <ProviderGearTableSkeleton />;

	if (isError) {
		return (
			<EmptyState
				icon={Package}
				title="Failed to load gear"
				description="There was an error fetching your inventory. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);
	}

	if (gears.length === 0) {
		return (
			<EmptyState
				icon={Package}
				title="No gear listed yet"
				description="Start building your inventory by adding your first piece of gear."
				action={
					<Link href="/provider-dashboard/add-gear">
						<Button>Add Your First Gear</Button>
					</Link>
				}
			/>
		);
	}

	return (
		<div className="rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Item</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Brand</TableHead>
						<TableHead>Price/Day</TableHead>
						<TableHead>Stock</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{gears.map((gear) => (
						<TableRow key={gear.id}>
							<TableCell>
								<div className="flex items-center gap-3">
									<div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted border">
										{gear.images?.[0] ? (
											<Image
												src={gear.images[0]}
												alt={gear.title}
												fill
												className="object-cover"
											/>
										) : (
											<div className="flex items-center justify-center h-full">
												<Package className="h-5 w-5 text-muted-foreground" />
											</div>
										)}
									</div>
									<span className="font-medium line-clamp-1">
										{gear.title}
									</span>
								</div>
							</TableCell>
							<TableCell className="text-muted-foreground">
								{gear.category?.name}
							</TableCell>
							<TableCell>{gear.brand}</TableCell>
							<TableCell>
								{formatPrice(gear.pricePerDay)}
							</TableCell>
							<TableCell>{gear.quantity}</TableCell>
							<TableCell>
								{gear.isAvailable ? (
									<span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
										<CheckCircle className="h-4 w-4" />{" "}
										Available
									</span>
								) : (
									<span className="inline-flex items-center gap-1 text-destructive text-sm font-medium">
										<XCircle className="h-4 w-4" />{" "}
										Unavailable
									</span>
								)}
							</TableCell>
							<TableCell className="text-right">
								<GearRowActions gear={gear} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

const ProviderGearTableSkeleton = () => {
	return (
		<div className="rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Item</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Brand</TableHead>
						<TableHead>Price/Day</TableHead>
						<TableHead>Stock</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, i) => (
						<TableRow key={i}>
							<TableCell>
								<div className="flex items-center gap-3">
									<Skeleton className="h-10 w-10 rounded-md" />
									<Skeleton className="h-4 w-32" />
								</div>
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-20" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-20" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-12" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-8" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-24" />
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
};
