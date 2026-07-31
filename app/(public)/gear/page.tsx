import { Suspense } from "react";
import getGears, {
	type GearFilters as GearFiltersType,
} from "../_actions/getGear";
import getCategories from "../_actions/getCategoryBrand";
import GearList from "../_components/gear/GearList";
import GearFilters from "../_components/gear/GearFilters";
import GearGridSkeleton from "../_components/gear/GearGridSkeleton";
import EmptyGearState from "../_components/gear/EmptyGearState";
import GearPagination from "../_components/gear/GearPagination";
import SearchBar from "../_components/gear/SearchBar";
import { SlidersHorizontal } from "lucide-react";

interface GearPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const GearPage = async ({ searchParams }: GearPageProps) => {
	const resolvedSearchParams = await searchParams;

	const filters: GearFiltersType = {
		category: resolvedSearchParams.category as string,
		brand: resolvedSearchParams.brand as string,
		minPrice: resolvedSearchParams.minPrice as string,
		maxPrice: resolvedSearchParams.maxPrice as string,
		search: resolvedSearchParams.search as string,
		page: (resolvedSearchParams.page as string) || "1",
		limit: "10",
		sortBy: (resolvedSearchParams.sortBy as string) || "createdAt",
		sortOrder: (resolvedSearchParams.sortOrder as string) || "desc",
	};

	const [gearsResponse, categoriesResponse] = await Promise.all([
		getGears(filters),
		getCategories(),
	]);

	const categories = categoriesResponse.success
		? categoriesResponse.data
		: [];
	const gears = gearsResponse.success ? gearsResponse.data : [];
	const meta = gearsResponse.meta;

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
				<aside className="w-full lg:w-64 shrink-0 space-y-6">
					<div className="bg-card p-5 rounded-xl border shadow-sm">
						<div className="flex items-center gap-2 mb-4">
							<SlidersHorizontal className="h-5 w-5 text-primary" />
							<h2 className="font-semibold">Filters</h2>
						</div>
						<GearFilters categories={categories} />
					</div>
				</aside>

				<main className="flex-1 space-y-6">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<SearchBar />
						<p className="text-sm text-muted-foreground">
							Showing {gears.length} of {meta?.total || 0} results
						</p>
					</div>

					<Suspense fallback={<GearGridSkeleton />}>
						{gears.length > 0 ? (
							<>
								<GearList gears={gears} />
								{meta && <GearPagination meta={meta} />}
							</>
						) : (
							<EmptyGearState />
						)}
					</Suspense>
				</main>
			</div>
		</div>
	);
};

export default GearPage;
