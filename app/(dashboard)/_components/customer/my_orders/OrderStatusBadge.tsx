import { Badge } from "@/components/ui/badge";
import { RentalStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
	status: RentalStatus;
}

const statusConfig: Record<RentalStatus, { label: string; className: string }> =
	{
		PLACED: {
			label: "Placed",
			className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
		},
		CONFIRMED: {
			label: "Confirmed",
			className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
		},
		PAID: {
			label: "Paid",
			className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
		},
		PICKED_UP: {
			label: "Picked Up",
			className: "bg-green-500/10 text-green-600 border-green-500/20",
		},
		RETURNED: {
			label: "Returned",
			className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
		},
		CANCELLED: {
			label: "Cancelled",
			className:
				"bg-destructive/10 text-destructive border-destructive/20",
		},
	};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
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
