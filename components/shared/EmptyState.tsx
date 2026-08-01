import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<Card className={cn("border-dashed bg-muted/30", className)}>
			<CardContent className="flex flex-col items-center justify-center py-16 text-center">
				<div className="bg-background rounded-full p-4 mb-4 shadow-sm border">
					<Icon className="h-8 w-8 text-muted-foreground" />
				</div>
				<h3 className="text-lg font-semibold mb-2">{title}</h3>
				<p className="text-sm text-muted-foreground max-w-sm mb-6">
					{description}
				</p>
				{action && <div>{action}</div>}
			</CardContent>
		</Card>
	);
}
