import { Metadata } from "next";
import { ReviewsList } from "../../_components/customer/my_reviews/ReviewsList";

export const metadata: Metadata = {
	title: "My Reviews | GearUp",
	description: "View all the reviews you have left on rented gear.",
};

const MyReviewsPage = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					My Reviews
				</h1>
				<p className="text-muted-foreground">
					See all the feedback you&apos;ve shared about your rental
					experiences.
				</p>
			</div>
			<ReviewsList />
		</div>
	);
};

export default MyReviewsPage;
