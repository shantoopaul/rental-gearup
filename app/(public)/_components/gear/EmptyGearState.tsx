import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmptyGearState = () => {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center">
			<div className="bg-muted rounded-full p-6 mb-4">
				<SearchX className="h-12 w-12 text-muted-foreground" />
			</div>
			<h3 className="text-xl font-semibold mb-2">No gear found</h3>
			<p className="text-muted-foreground max-w-md mb-6">
				We couldn&apos;t find any gear matching your current filters.
				Try adjusting your search criteria or browse all available
				equipment.
			</p>
			<Button>
				<Link href="/gear">Clear all filters</Link>
			</Button>
		</div>
	);
};

export default EmptyGearState;
