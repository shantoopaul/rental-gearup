import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
	status: PaymentStatus;
}

const statusConfig: Record<
	PaymentStatus,
	{ label: string; className: string }
> = {
	PENDING: {
		label: "Pending",
		className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
	},
	COMPLETED: {
		label: "Completed",
		className: "bg-green-500/10 text-green-600 border-green-500/20",
	},
	FAILED: {
		label: "Failed",
		className: "bg-destructive/10 text-destructive border-destructive/20",
	},
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
	const config = statusConfig[status];
	return (
		<Badge
			variant="outline"
			className={cn("font-medium", config.className)}
		>
			{config.label}
		</Badge>
	);
}
