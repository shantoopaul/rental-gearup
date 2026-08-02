"use client";

import { useState, useTransition } from "react";
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
import { updateGearStock } from "@/app/(dashboard)/_actions/providerGearActions";
import { toast } from "sonner";
import { GearItem } from "@/lib/types";

interface UpdateStockDialogProps {
	gear: GearItem;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function UpdateStockDialog({
	gear,
	open,
	onOpenChange,
}: UpdateStockDialogProps) {
	const [quantity, setQuantity] = useState(gear.quantity);
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (quantity < 1) {
			toast.error("Quantity must be at least 1");
			return;
		}
		startTransition(async () => {
			const result = await updateGearStock(gear.id, quantity);
			if (result.success) {
				toast.success(result.message);
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
					<DialogTitle>Update Stock</DialogTitle>
					<DialogDescription>
						Adjust the available inventory for &quot;{gear.title}
						&quot;.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="quantity">Quantity in Stock</Label>
						<Input
							id="quantity"
							type="number"
							min="1"
							value={quantity}
							onChange={(e) =>
								setQuantity(Number(e.target.value))
							}
							disabled={isPending}
						/>
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
							{isPending ? "Updating..." : "Update Stock"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
