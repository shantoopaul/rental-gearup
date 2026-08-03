"use client";

import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	createCategory,
	updateCategory,
} from "@/app/(dashboard)/_actions/categoryActions";
import { toast } from "sonner";
import { Category } from "@/lib/types";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { useSWRConfig } from "swr";

interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: Category | null;
}

export function CategoryFormDialog({
	open,
	onOpenChange,
	category,
}: CategoryFormDialogProps) {
	const [isPending, startTransition] = useTransition();
	const { mutate } = useSWRConfig();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CategoryInput>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: "",
		},
	});

	useEffect(() => {
		if (open) {
			reset({ name: category?.name || "" });
		}
	}, [open, category, reset]);

	const onSubmit = (data: CategoryInput) => {
		startTransition(async () => {
			const result = category
				? await updateCategory(category.id, data.name)
				: await createCategory(data.name);
			if (result.success) {
				toast.success(result.message);
				mutate("/categories");
				onOpenChange(false);
			} else {
				toast.error(result.message);
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{category ? "Edit Category" : "Add New Category"}
					</DialogTitle>
					<DialogDescription>
						{category
							? "Update the name of the gear category."
							: "Create a new category for gear items."}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4 py-4"
				>
					<div className="space-y-2">
						<Label htmlFor="name">Category Name</Label>
						<Input
							id="name"
							placeholder="e.g. Camping, Bikes, Drones"
							{...register("name")}
							disabled={isPending}
							autoFocus
						/>
						{errors.name && (
							<p className="text-sm text-destructive">
								{errors.name.message}
							</p>
						)}
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending
								? category
									? "Updating..."
									: "Creating..."
								: category
									? "Update Category"
									: "Create Category"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
