"use client";

import { PaginationMeta } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GearPaginationProps {
	meta: PaginationMeta;
}

const GearPagination = ({ meta }: GearPaginationProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentPage = meta.page;
	const totalPages = meta.totalPages;

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", newPage.toString());
		router.push(`${pathname}?${params.toString()}`);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-2 mt-8">
			<Button
				variant="outline"
				size="sm"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage <= 1}
			>
				<ChevronLeft className="h-4 w-4 mr-1" /> Previous
			</Button>

			<span className="text-sm text-muted-foreground px-4">
				Page {currentPage} of {totalPages}
			</span>

			<Button
				variant="outline"
				size="sm"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
			>
				Next <ChevronRight className="h-4 w-4 ml-1" />
			</Button>
		</div>
	);
};

export default GearPagination;
