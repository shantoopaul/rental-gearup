"use client";

import { Category } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GearFiltersProps {
	categories: Category[];
}

const GearFilters = ({ categories }: GearFiltersProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const brand = searchParams.get("brand") || "";
	const minPrice = searchParams.get("minPrice") || "";
	const maxPrice = searchParams.get("maxPrice") || "";

	const updateFilter = (key: string, value: string | null) => {
		const params = new URLSearchParams(searchParams);
		if (value && value.trim()) {
			params.set(key, value.trim());
		} else {
			params.delete(key);
		}
		params.set("page", "1");
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-semibold mb-3">Category</h3>
				<Select
					value={searchParams.get("category") || "All Categories"}
					onValueChange={(value) =>
						updateFilter("category", value === "all" ? "" : value)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						{categories.map((cat) => (
							<SelectItem key={cat.id} value={cat.name}>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<h3 className="font-semibold mb-3">Brand</h3>
				<Input
					id="brand"
					type="text"
					placeholder="e.g. Nike, Patagonia"
					defaultValue={brand}
					onBlur={(e) => updateFilter("brand", e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							updateFilter("brand", e.currentTarget.value);
						}
					}}
					className="h-9"
				/>
			</div>

			<div>
				<h3 className="font-semibold mb-3">Price</h3>
				<div className="flex items-center gap-2">
					<div className="space-y-1">
						<Label
							htmlFor="minPrice"
							className="text-xs text-muted-foreground"
						>
							Min
						</Label>
						<Input
							id="minPrice"
							type="number"
							placeholder="0"
							defaultValue={minPrice}
							onBlur={(e) =>
								updateFilter("minPrice", e.target.value)
							}
							className="h-9"
						/>
					</div>
					<span className="mt-5 text-muted-foreground">-</span>
					<div className="space-y-1">
						<Label
							htmlFor="maxPrice"
							className="text-xs text-muted-foreground"
						>
							Max
						</Label>
						<Input
							id="maxPrice"
							type="number"
							placeholder="999"
							defaultValue={maxPrice}
							onBlur={(e) =>
								updateFilter("maxPrice", e.target.value)
							}
							className="h-9"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GearFilters;
