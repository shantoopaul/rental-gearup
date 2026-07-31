"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SearchBar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handleSearch = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams);
		if (term) {
			params.set("search", term);
		} else {
			params.delete("search");
		}
		params.set("page", "1");
		router.push(`${pathname}?${params.toString()}`);
	}, 300);

	return (
		<div className="relative w-full max-w-sm">
			<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search gear by name or description..."
				className="pl-9"
				defaultValue={searchParams.get("search")?.toString()}
				onChange={(e) => handleSearch(e.target.value)}
			/>
		</div>
	);
};

export default SearchBar;
