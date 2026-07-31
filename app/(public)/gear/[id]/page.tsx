import { notFound } from "next/navigation";
import getGearDetails from "../../_actions/getGearDetails";
import GearImageGallery from "../../_components/gearDetails/GearImageGallery";
import GearInfoSection from "../../_components/gearDetails/GearInfoSection";
import GearReviewSection from "../../_components/gearDetails/GearReviewSection";

interface GearDetailsPageProps {
	params: Promise<{ id: string }>;
}

const GearDetailsPage = async ({ params }: GearDetailsPageProps) => {
	const { id } = await params;
	const response = await getGearDetails(id);

	if (!response.success || !response.data) {
		notFound();
	}

	const gear = response.data;

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
				<GearImageGallery images={gear.images} title={gear.title} />
				<div className="space-y-8">
					<GearInfoSection gear={gear} />
				</div>
			</div>

			<GearReviewSection gearId={gear.id} reviews={gear.reviews || []} />
		</div>
	);
};

export default GearDetailsPage;
