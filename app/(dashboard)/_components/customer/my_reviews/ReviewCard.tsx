import { RentalOrder } from "@/lib/types";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Package } from "lucide-react";

interface ReviewCardProps {
	order: RentalOrder;
}

export const ReviewCard = ({ order }: ReviewCardProps) => {
	const review = order.reviews;
	if (!review) return null;

	const gear = order.gearItem;
	const imageUrl = gear.images?.[0];
	const reviewDate = new Date(review.createdAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	return (
		<Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">
			<CardHeader className="p-4 pb-0">
				<div className="flex items-center gap-4">
					<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted border">
						{imageUrl ? (
							<Image
								src={imageUrl}
								alt={gear.title}
								fill
								className="object-cover"
								sizes="64px"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<Package className="h-6 w-6 text-muted-foreground" />
							</div>
						)}
					</div>
					<div className="flex-1 overflow-hidden">
						<h3
							className="font-semibold truncate"
							title={gear.title}
						>
							{gear.title}
						</h3>
						<p className="text-xs text-muted-foreground truncate">
							{gear.brand} • {gear.category?.name}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex-1 p-4 space-y-3">
				<div className="flex items-center justify-between">
					<Rating value={review.rating} readonly size={20} />
					<span className="text-xs text-muted-foreground flex items-center gap-1">
						<Calendar className="h-3 w-3" />
						{reviewDate}
					</span>
				</div>
				{review.comment ? (
					<p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
						{review.comment}
					</p>
				) : (
					<p className="text-sm text-muted-foreground italic">
						No comment provided.
					</p>
				)}
			</CardContent>
			<CardFooter className="p-4 pt-0 border-t bg-muted/30">
				<Link
					href={`/dashboard/my-orders/${order.id}`}
					className="w-full"
				>
					<Button variant="outline" size="sm" className="w-full">
						View Order Details
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};
