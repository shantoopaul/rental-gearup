"use client";
import { GearItem } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

interface GearCardProps {
	gear: GearItem;
}

const GearCard = ({ gear }: GearCardProps) => {
	const price =
		typeof gear.pricePerDay === "string"
			? parseFloat(gear.pricePerDay)
			: gear.pricePerDay;
	const imageUrl = gear.images?.[0];

	return (
		<Card className="overflow-hidden flex flex-col transition-all hover:shadow-md pt-0">
			<div className="relative aspect-video w-full overflow-hidden bg-muted">
				<Image
					src={imageUrl}
					alt={gear.title}
					fill
					className="object-cover transition-transform hover:scale-105"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				{!gear.isAvailable && (
					<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
						<Badge
							variant="destructive"
							className="text-sm px-3 py-1"
						>
							Currently Unavailable
						</Badge>
					</div>
				)}
				<Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm">
					{gear.category.name}
				</Badge>
			</div>

			<CardContent className="flex-1 p-4 space-y-2">
				<h3
					className="font-semibold text-lg line-clamp-1"
					title={gear.title}
				>
					{gear.title}
				</h3>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{gear.description}
				</p>
			</CardContent>

			<CardFooter className="p-4 flex items-center justify-between border-t bg-muted/30">
				<div className="flex flex-col">
					<span className="text-2xl font-bold text-primary">
						${price.toFixed(2)}
						<span className="text-sm font-bold text-gray-500">
							{" "}
							/ day
						</span>
					</span>
				</div>
				<Link href={`/gear/${gear.id}`}>
					<InteractiveHoverButton
						disabled={!gear.isAvailable}
						className="py-3"
					>
						View Details
					</InteractiveHoverButton>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default GearCard;
