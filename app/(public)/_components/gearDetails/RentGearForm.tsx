"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createRentalAndPay } from "../../_actions/rentActions";
import { toast } from "sonner";

interface RentGearFormProps {
	gearId: string;
	pricePerDay: number;
	maxQuantity: number;
}

export const RentGearForm = ({
	gearId,
	pricePerDay,
	maxQuantity,
}: RentGearFormProps) => {
	const [isPending, startTransition] = useTransition();

	const today = new Date().toISOString().split("T")[0];
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [quantity, setQuantity] = useState(1);

	const days =
		startDate && endDate
			? Math.max(
					1,
					Math.ceil(
						(new Date(endDate).getTime() -
							new Date(startDate).getTime()) /
							(1000 * 60 * 60 * 24),
					),
				)
			: 0;

	const totalPrice = days * pricePerDay * quantity;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!startDate || !endDate) {
			toast.error("Please select both start and end dates.");
			return;
		}
		if (new Date(endDate) <= new Date(startDate)) {
			toast.error("End date must be after start date.");
			return;
		}

		const formData = new FormData(e.currentTarget);

		startTransition(async () => {
			try {
				await createRentalAndPay(formData);
			} catch (error) {
				if (error instanceof Error) {
					toast.error(
						error.message ||
							"Failed to process rental. Please ensure you are logged in.",
					);
				}
			}
		});
	};

	return (
		<Card className="sticky top-24 border-2 border-primary/20 shadow-lg">
			<CardHeader>
				<CardTitle className="text-xl">Rent this Gear</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input type="hidden" name="gearItemId" value={gearId} />

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="startDate">Start Date</Label>
							<Input
								id="startDate"
								name="startDate"
								type="date"
								min={today}
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="endDate">End Date</Label>
							<Input
								id="endDate"
								name="endDate"
								type="date"
								min={startDate || today}
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="quantity">
							Quantity (Max: {maxQuantity})
						</Label>
						<Input
							id="quantity"
							name="quantity"
							type="number"
							min={1}
							max={maxQuantity}
							value={quantity}
							onChange={(e) =>
								setQuantity(Number(e.target.value))
							}
							required
						/>
					</div>

					{days > 0 && (
						<div className="rounded-lg bg-muted p-4 space-y-2">
							<div className="flex justify-between text-sm text-muted-foreground">
								<span>
									${pricePerDay.toFixed(2)} × {days} days ×{" "}
									{quantity} items
								</span>
								<span className="font-semibold text-foreground">
									${totalPrice.toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
								<span>Total</span>
								<span className="text-primary">
									${totalPrice.toFixed(2)}
								</span>
							</div>
						</div>
					)}

					<Button
						type="submit"
						className="w-full"
						size="lg"
						disabled={isPending || days <= 0}
					>
						{isPending ? "Processing..." : "Rent Now & Pay"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};
