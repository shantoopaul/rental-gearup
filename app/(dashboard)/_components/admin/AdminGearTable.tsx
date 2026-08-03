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
import { useAdminGear } from "@/app/(dashboard)/_hooks/useAdminGear";
import { useState, useMemo } from "react";
import {
	Package,
	Search,
	ChevronLeft,
	ChevronRight,
	Eye,
	ShieldAlert,
} from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const formatPrice = (price: number | string) => `$${Number(price).toFixed(2)}`;

interface AdminGearTableProps {
	limit?: number;
	enableSearchAndPagination?: boolean;
}

export const AdminGearTable = ({
	limit,
	enableSearchAndPagination = false,
}: AdminGearTableProps) => {
	const { gears, isLoading, isError } = useAdminGear();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const filteredGears = useMemo(() => {
		if (!searchQuery.trim()) return gears;
		const query = searchQuery.toLowerCase();
		return gears.filter(
			(gear) =>
				gear.title.toLowerCase().includes(query) ||
				gear.brand.toLowerCase().includes(query) ||
				gear.category?.name.toLowerCase().includes(query) ||
				gear.provider?.name.toLowerCase().includes(query),
		);
	}, [gears, searchQuery]);

	const paginatedGears = useMemo(() => {
		if (limit) return filteredGears.slice(0, limit);
		if (!enableSearchAndPagination) return filteredGears;
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredGears.slice(startIndex, startIndex + itemsPerPage);
	}, [
		filteredGears,
		limit,
		currentPage,
		enableSearchAndPagination,
		itemsPerPage,
	]);

	const totalPages = Math.ceil(filteredGears.length / itemsPerPage);

	if (isLoading) return <AdminGearTableSkeleton />;

	if (isError)
		return (
			<EmptyState
				icon={ShieldAlert}
				title="Failed to load gear"
				description="There was an error fetching the platform gear. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);

	if (gears.length === 0)
		return (
			<EmptyState
				icon={Package}
				title="No gear listed yet"
				description="There are currently no gear items listed on the platform."
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
							placeholder="Search by title, brand, category, or provider..."
							className="pl-9"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1);
							}}
						/>
					</div>
					<p className="text-sm text-muted-foreground whitespace-nowrap">
						Showing {paginatedGears.length} of{" "}
						{filteredGears.length} items
					</p>
				</div>
			)}
			<div className="rounded-md border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Item</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Provider</TableHead>
							<TableHead>Price/Day</TableHead>
							<TableHead>Stock</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedGears.length > 0 ? (
							paginatedGears.map((gear) => (
								<TableRow key={gear.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted border shrink-0">
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
											<div className="flex flex-col overflow-hidden">
												<span className="font-medium line-clamp-1">
													{gear.title}
												</span>
												<span className="text-xs text-muted-foreground line-clamp-1">
													{gear.brand}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{gear.category?.name || "N/A"}
									</TableCell>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-medium text-sm">
												{gear.provider?.name ||
													"Unknown"}
											</span>
											<span className="text-xs text-muted-foreground">
												{gear.provider?.email}
											</span>
										</div>
									</TableCell>
									<TableCell>
										{formatPrice(gear.pricePerDay)}
									</TableCell>
									<TableCell>{gear.quantity}</TableCell>
									<TableCell>
										{gear.isAvailable ? (
											<Badge
												variant="outline"
												className="bg-green-500/10 text-green-600 border-green-500/20"
											>
												Available
											</Badge>
										) : (
											<Badge
												variant="outline"
												className="bg-destructive/10 text-destructive border-destructive/20"
											>
												Unavailable
											</Badge>
										)}
									</TableCell>
									<TableCell className="text-right">
										<Link
											href={`/gear/${gear.id}`}
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
									colSpan={7}
									className="h-24 text-center text-muted-foreground"
								>
									No gear matches your search criteria.
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

const AdminGearTableSkeleton = () => {
	return (
		<div className="rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Item</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Provider</TableHead>
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
									<div className="flex flex-col gap-1">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-20" />
									</div>
								</div>
							</TableCell>
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
								<Skeleton className="h-4 w-12" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-8" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-5 w-20 rounded-full" />
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
