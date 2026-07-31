import getGears from "../../_actions/getGear";
import GearList from "./GearList";
import EmptyGearState from "./EmptyGearState";

const FeaturedGear = async () => {
	const response = await getGears({
		limit: "6",
		page: "1",
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const gears = response.success ? response.data : [];

	if (gears.length === 0) {
		return (
			<div className="py-10">
				<EmptyGearState />
			</div>
		);
	}

	return <GearList gears={gears} />;
};

export default FeaturedGear;
