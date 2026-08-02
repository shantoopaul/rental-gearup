"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gearSchema, type GearInput } from "@/lib/validations/gear";
import { createGear } from "@/app/(dashboard)/_actions/providerGearActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Category } from "@/lib/types";

interface ProviderGearFormProps {
	categories: Category[];
}

export const ProviderGearForm = ({ categories }: ProviderGearFormProps) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<GearInput>({
		resolver: zodResolver(gearSchema),
		defaultValues: {
			title: "",
			description: "",
			brand: "",
			pricePerDay: 1,
			quantity: 1,
			images: [""],
			categoryId: "",
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		// eslint-disable-next-line
		// @ts-ignore
		name: "images",
	});

	const onSubmit = (data: GearInput) => {
		startTransition(async () => {
			const result = await createGear(data);
			if (result.success) {
				toast.success(result.message);
				router.push("/provider-dashboard/my-gears");
			} else {
				toast.error(result.message);
			}
		});
	};

	return (
		<Card className="max-w-3xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl">Add New Gear</CardTitle>
			</CardHeader>
			<form onSubmit={handleSubmit(onSubmit)}>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								placeholder="e.g. Trekking Backpack 50L"
								{...register("title")}
								disabled={isPending}
							/>
							{errors.title && (
								<p className="text-sm text-destructive">
									{errors.title.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="brand">Brand</Label>
							<Input
								id="brand"
								placeholder="e.g. North Face"
								{...register("brand")}
								disabled={isPending}
							/>
							{errors.brand && (
								<p className="text-sm text-destructive">
									{errors.brand.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Describe the gear, its condition, and features..."
							{...register("description")}
							disabled={isPending}
							className="min-h-25"
						/>
						{errors.description && (
							<p className="text-sm text-destructive">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="space-y-2">
							<Label htmlFor="pricePerDay">
								Price per Day ($)
							</Label>
							<Input
								id="pricePerDay"
								type="number"
								step="0.01"
								{...register("pricePerDay", {
									valueAsNumber: true,
								})} // Converts string input to number for Zod
								disabled={isPending}
							/>
							{errors.pricePerDay && (
								<p className="text-sm text-destructive">
									{errors.pricePerDay.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="quantity">Quantity in Stock</Label>
							<Input
								id="quantity"
								type="number"
								{...register("quantity", {
									valueAsNumber: true,
								})} // Converts string input to number for Zod
								disabled={isPending}
							/>
							{errors.quantity && (
								<p className="text-sm text-destructive">
									{errors.quantity.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="categoryId">Category</Label>
							<Controller
								control={control}
								name="categoryId"
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										value={field.value}
										disabled={isPending}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{categories.map((cat) => (
												<SelectItem
													key={cat.id}
													value={cat.id}
												>
													{cat.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.categoryId && (
								<p className="text-sm text-destructive">
									{errors.categoryId.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label>Image URLs</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => append("")}
								disabled={isPending}
							>
								<Plus className="h-4 w-4 mr-1" /> Add Image
							</Button>
						</div>
						<div className="space-y-3">
							{fields.map((field, index) => (
								<div
									key={field.id}
									className="flex items-center gap-2"
								>
									<div className="relative flex-1">
										<ImageIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="https://images.unsplash.com/..."
											{...register(`images.${index}`)}
											className="pl-9"
											disabled={isPending}
										/>
									</div>
									{fields.length > 1 && (
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											onClick={() => remove(index)}
											disabled={isPending}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									)}
								</div>
							))}
						</div>
						{/* RHF v7.84+ places array-level schema errors under .root */}
						{errors.images?.root?.message && (
							<p className="text-sm text-destructive">
								{errors.images.root.message}
							</p>
						)}
					</div>
				</CardContent>
				<CardFooter className="flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.back()}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? "Creating..." : "Create Gear"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
};
