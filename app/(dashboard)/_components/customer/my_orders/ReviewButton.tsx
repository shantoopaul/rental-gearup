"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { LeaveReviewDialog } from "./LeaveReviewDialog";

export function ReviewButton({
	orderId,
	gearTitle,
}: {
	orderId: string;
	gearTitle: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button size="lg" onClick={() => setOpen(true)}>
				<MessageSquare className="mr-2 h-4 w-4" /> Leave a Review
			</Button>
			<LeaveReviewDialog
				rentalOrderId={orderId}
				gearTitle={gearTitle}
				open={open}
				onOpenChange={setOpen}
			/>
		</>
	);
}
