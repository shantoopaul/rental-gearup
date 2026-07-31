import { Review } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface GearReviewSectionProps {
	gearId: string;
	reviews: Review[];
}

const GearReviewSection = ({ gearId, reviews }: GearReviewSectionProps) => {
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold tracking-tight">
				Customer Reviews
			</h2>

			{reviews.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center">
						<Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							No reviews yet
						</h3>
						<p className="text-muted-foreground">
							Be the first to review this gear after your rental!
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6">
					{reviews.map((review) => (
						<Card key={review.id}>
							<CardHeader className="pb-3">
								<div className="flex items-center gap-3">
									<Avatar>
										<AvatarFallback>
											{review.customer.name
												.charAt(0)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle className="text-base">
											{review.customer.name}
										</CardTitle>
										<p className="text-xs text-muted-foreground">
											{new Date(
												review.createdAt,
											).toLocaleDateString()}
										</p>
									</div>
									<div className="ml-auto flex items-center gap-1">
										{Array.from({ length: 5 }).map(
											(_, i) => (
												<Star
													key={i}
													className={cn(
														"h-4 w-4",
														i < review.rating
															? "fill-yellow-400 text-yellow-400"
															: "fill-muted text-muted",
													)}
												/>
											),
										)}
									</div>
								</div>
							</CardHeader>
							{review.comment && (
								<CardContent className="pt-0">
									<p className="text-muted-foreground">
										{review.comment}
									</p>
								</CardContent>
							)}
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default GearReviewSection;
