"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Trash2 } from "lucide-react";
import {
	toggleGearAvailability,
	deleteGear,
} from "@/app/(dashboard)/_actions/providerGearActions";
import { toast } from "sonner";
import { GearItem } from "@/lib/types";

export const GearRowActions = ({ gear }: { gear: GearItem }) => {
	const [isPending, startTransition] = useTransition();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [toggleDialogOpen, setToggleDialogOpen] = useState(false);

	const handleToggleAvailability = () => {
		startTransition(async () => {
			const result = await toggleGearAvailability(
				gear.id,
				gear.isAvailable,
			);
			if (result.success) {
				toast.success(result.message);
				setToggleDialogOpen(false);
			} else {
				toast.error(result.message);
			}
		});
	};

	const handleDelete = () => {
		startTransition(async () => {
			const result = await deleteGear(gear.id);
			if (result.success) {
				toast.success(result.message);
				setDeleteDialogOpen(false);
			} else {
				toast.error(result.message);
			}
		});
	};

	return (
		<>
			<div className="flex justify-end gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setToggleDialogOpen(true)}
					disabled={isPending}
				>
					{gear.isAvailable ? "Mark Unavailable" : "Mark Available"}
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					className="text-destructive hover:bg-destructive/10"
					onClick={() => setDeleteDialogOpen(true)}
					disabled={isPending}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>

			<ConfirmDialog
				open={toggleDialogOpen}
				onOpenChange={setToggleDialogOpen}
				title={
					gear.isAvailable
						? "Mark as Unavailable?"
						: "Mark as Available?"
				}
				description={
					gear.isAvailable
						? "This gear will be hidden from customers and cannot be rented until marked available again."
						: "This gear will be visible to customers and available for rent."
				}
				confirmText={
					gear.isAvailable ? "Mark Unavailable" : "Mark Available"
				}
				onConfirm={handleToggleAvailability}
				isLoading={isPending}
			/>

			<ConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title="Delete Gear?"
				description="Are you sure you want to permanently remove this gear from your inventory? This action cannot be undone."
				confirmText="Delete"
				onConfirm={handleDelete}
				isLoading={isPending}
				variant="destructive"
			/>
		</>
	);
};
