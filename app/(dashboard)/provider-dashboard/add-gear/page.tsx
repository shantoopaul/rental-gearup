import { Metadata } from "next";
import { ProviderGearForm } from "../../_components/provider/gear/ProviderGearForm";
import getCategories from "@/app/(public)/_actions/getCategoryBrand";

export const metadata: Metadata = {
	title: "Add Gear | GearUp Provider",
	description: "Add new equipment to your rental inventory.",
};

const AddGearPage = async () => {
	const categoriesResponse = await getCategories();
	const categories = categoriesResponse.success
		? categoriesResponse.data
		: [];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Add New Gear
				</h1>
				<p className="text-muted-foreground">
					Fill out the details below to list a new item in your
					inventory.
				</p>
			</div>
			<ProviderGearForm categories={categories} />
		</div>
	);
};

export default AddGearPage;
