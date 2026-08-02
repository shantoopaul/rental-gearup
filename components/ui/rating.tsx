"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RatingProps {
	value: number;
	onChange?: (value: number) => void;
	readonly?: boolean;
	size?: number;
	className?: string;
}

export function Rating({
	value,
	onChange,
	readonly = false,
	size = 24,
	className,
}: RatingProps) {
	const [hoverValue, setHoverValue] = useState(0);

	return (
		<div className={cn("flex items-center gap-1", className)}>
			{[1, 2, 3, 4, 5].map((star) => {
				const isActive = readonly
					? star <= value
					: star <= (hoverValue || value);

				return (
					<button
						key={star}
						type="button"
						disabled={readonly}
						onClick={() => onChange?.(star)}
						onMouseEnter={() => !readonly && setHoverValue(star)}
						onMouseLeave={() => !readonly && setHoverValue(0)}
						className={cn(
							"transition-transform focus:outline-none",
							readonly
								? "cursor-default"
								: "cursor-pointer hover:scale-110",
						)}
						aria-label={`Rate ${star} out of 5 stars`}
					>
						<Star
							size={size}
							className={cn(
								"transition-colors",
								isActive
									? "fill-yellow-400 text-yellow-400"
									: "fill-muted text-muted-foreground",
							)}
						/>
					</button>
				);
			})}
		</div>
	);
}
