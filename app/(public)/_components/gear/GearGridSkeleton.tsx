import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const GearGridSkeleton = () => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: 6 }).map((_, i) => (
				<Card key={i} className="overflow-hidden flex flex-col">
					<Skeleton className="aspect-video w-full" />
					<CardContent className="flex-1 p-4 space-y-3">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-1/2" />
					</CardContent>
					<CardFooter className="p-4 pt-0 flex items-center justify-between border-t bg-muted/30">
						<Skeleton className="h-8 w-20" />
						<Skeleton className="h-9 w-28" />
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default GearGridSkeleton;
