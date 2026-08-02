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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Rating } from "@/components/ui/rating";
import { createReview } from "@/app/(dashboard)/_actions/reviewActions";
import { toast } from "sonner";

interface LeaveReviewDialogProps {
	rentalOrderId: string;
	gearTitle: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function LeaveReviewDialog({
	rentalOrderId,
	gearTitle,
	open,
	onOpenChange,
}: LeaveReviewDialogProps) {
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (rating < 1 || rating > 5) {
			toast.error("Please select a rating between 1 and 5 stars.");
			return;
		}

		startTransition(async () => {
			const result = await createReview(rentalOrderId, rating, comment);
			if (result.success) {
				toast.success(result.message);
				setRating(5);
				setComment("");
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
					<DialogTitle>Leave a Review</DialogTitle>
					<DialogDescription>
						How was your experience renting &quot;{gearTitle}&quot;?
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2 flex flex-col items-center">
						<Label>Rating</Label>
						<Rating value={rating} onChange={setRating} size={32} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="comment">Comment (Optional)</Label>
						<Textarea
							id="comment"
							placeholder="Share your thoughts about the gear..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							disabled={isPending}
							className="min-h-25"
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
							{isPending ? "Submitting..." : "Submit Review"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
