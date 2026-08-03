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
import { useAdminCategories } from "@/app/(dashboard)/_hooks/useAdminCategories";
import { deleteCategory } from "@/app/(dashboard)/_actions/categoryActions";
import { toast } from "sonner";
import { useTransition, useState, useMemo } from "react";
import {
	Settings,
	Search,
	Edit,
	Trash2,
	Plus,
	ShieldAlert,
} from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { Category } from "@/lib/types";

export const AdminCategoriesTable = () => {
	const { categories, isLoading, isError, mutate } = useAdminCategories();
	const [isPending, startTransition] = useTransition();
	const [searchQuery, setSearchQuery] = useState("");

	const [formDialog, setFormDialog] = useState<{
		open: boolean;
		category: Category | null;
	}>({ open: false, category: null });

	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean;
		category: Category | null;
	}>({ open: false, category: null });

	const handleDelete = () => {
		if (!deleteDialog.category) return;
		startTransition(async () => {
			const result = await deleteCategory(deleteDialog.category!.id);
			if (result.success) {
				toast.success(result.message);
				mutate();
			} else {
				toast.error(result.message);
			}
			setDeleteDialog({ open: false, category: null });
		});
	};

	const filteredCategories = useMemo(() => {
		if (!searchQuery.trim()) return categories;
		const query = searchQuery.toLowerCase();
		return categories.filter((cat) =>
			cat.name.toLowerCase().includes(query),
		);
	}, [categories, searchQuery]);

	if (isLoading) return <AdminCategoriesTableSkeleton />;

	if (isError)
		return (
			<EmptyState
				icon={ShieldAlert}
				title="Failed to load categories"
				description="There was an error fetching the categories. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);

	return (
		<>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search categories..."
						className="pl-9"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Button
					onClick={() =>
						setFormDialog({ open: true, category: null })
					}
				>
					<Plus className="h-4 w-4 mr-2" /> Add Category
				</Button>
			</div>

			{filteredCategories.length === 0 && categories.length > 0 ? (
				<EmptyState
					icon={Search}
					title="No results found"
					description="No categories match your search criteria."
				/>
			) : filteredCategories.length === 0 ? (
				<EmptyState
					icon={Settings}
					title="No categories yet"
					description="Start by adding your first gear category."
					action={
						<Button
							onClick={() =>
								setFormDialog({ open: true, category: null })
							}
						>
							<Plus className="h-4 w-4 mr-2" /> Add Category
						</Button>
					}
				/>
			) : (
				<div className="rounded-md border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>ID</TableHead>
								<TableHead className="text-right">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredCategories.map((cat) => (
								<TableRow key={cat.id}>
									<TableCell className="font-medium">
										{cat.name}
									</TableCell>
									<TableCell className="text-muted-foreground font-mono text-xs">
										{cat.id.slice(0, 8)}...
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													setFormDialog({
														open: true,
														category: cat,
													})
												}
												disabled={isPending}
											>
												<Edit className="h-4 w-4 mr-1" />{" "}
												Edit
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-destructive hover:text-destructive"
												onClick={() =>
													setDeleteDialog({
														open: true,
														category: cat,
													})
												}
												disabled={isPending}
											>
												<Trash2 className="h-4 w-4 mr-1" />{" "}
												Delete
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<CategoryFormDialog
				open={formDialog.open}
				onOpenChange={(open) =>
					setFormDialog((prev) => ({ ...prev, open }))
				}
				category={formDialog.category}
			/>

			<ConfirmDialog
				open={deleteDialog.open}
				onOpenChange={(open) =>
					setDeleteDialog((prev) => ({ ...prev, open }))
				}
				title="Delete Category?"
				description={`Are you sure you want to delete "${deleteDialog.category?.name}"? This action cannot be undone and may affect existing gear items.`}
				confirmText="Delete"
				onConfirm={handleDelete}
				isLoading={isPending}
				variant="destructive"
			/>
		</>
	);
};

const AdminCategoriesTableSkeleton = () => {
	return (
		<div className="rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>ID</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, i) => (
						<TableRow key={i}>
							<TableCell>
								<Skeleton className="h-4 w-32" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-20" />
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-2">
									<Skeleton className="h-8 w-20" />
									<Skeleton className="h-8 w-20" />
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
