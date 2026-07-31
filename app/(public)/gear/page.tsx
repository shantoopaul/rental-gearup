import { Suspense } from "react";
import getGears from "../_actions/getGear";
import getCategories from "../_actions/getCategoryBrand";
import GearList from "../_components/gear/GearList";
import GearGridSkeleton from "../_components/gear/GearGridSkeleton";
import EmptyGearState from "../_components/gear/EmptyGearState";

export default async function GearPage() {
	const [gearsResponse] = await Promise.all([getGears(), getCategories()]);

	const gears = gearsResponse.success ? gearsResponse.data : [];

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<div className="mb-8 space-y-4">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
					Browse Gear
				</h1>
				<p className="text-muted-foreground max-w-2xl">
					Find the perfect equipment for your next adventure. Filter
					by category, price, and availability.
				</p>
			</div>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Main Content */}
				<main className="flex-1 space-y-6">
					<Suspense fallback={<GearGridSkeleton />}>
						{gears.length > 0 ? (
							<>
								<GearList gears={gears} />
							</>
						) : (
							<EmptyGearState />
						)}
					</Suspense>
				</main>
			</div>
		</div>
	);
}
