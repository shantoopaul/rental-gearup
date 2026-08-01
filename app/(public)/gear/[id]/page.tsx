import { notFound } from "next/navigation";
import getGearDetails from "../../_actions/getGearDetails";
import GearImageGallery from "../../_components/gearDetails/GearImageGallery";
import GearInfoSection from "../../_components/gearDetails/GearInfoSection";
import GearReviewSection from "../../_components/gearDetails/GearReviewSection";
import { RentGearForm } from "../../_components/gearDetails/RentGearForm";

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
	const price =
		typeof gear.pricePerDay === "string"
			? parseFloat(gear.pricePerDay)
			: gear.pricePerDay;

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
				<GearImageGallery images={gear.images} title={gear.title} />
				<div className="space-y-8">
					<GearInfoSection gear={gear} />
					{gear.isAvailable && (
						<RentGearForm
							gearId={gear.id}
							pricePerDay={price}
							maxQuantity={gear.quantity}
						/>
					)}
				</div>
			</div>

			<GearReviewSection gearId={gear.id} reviews={gear.reviews || []} />
		</div>
	);
};

export default GearDetailsPage;
