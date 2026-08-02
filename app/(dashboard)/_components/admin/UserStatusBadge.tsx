import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserStatusBadgeProps {
	status: UserStatus;
}

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
	ACTIVE: {
		label: "Active",
		className: "bg-green-500/10 text-green-600 border-green-500/20",
	},
	SUSPENDED: {
		label: "Suspended",
		className: "bg-destructive/10 text-destructive border-destructive/20",
	},
};

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
	const config = statusConfig[status];
	return (
		<Badge
			variant="outline"
			className={cn("font-medium", config.className)}
		>
			{config.label}
		</Badge>
	);
};
