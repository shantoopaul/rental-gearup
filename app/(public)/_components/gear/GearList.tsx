import { GearItem } from "@/lib/types";
import GearCard from "./GearCard";

interface GearListProps {
	gears: GearItem[];
}

const GearList = ({ gears }: GearListProps) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{gears.map((gear) => (
				<GearCard key={gear.id} gear={gear} />
			))}
		</div>
	);
};

export default GearList;
