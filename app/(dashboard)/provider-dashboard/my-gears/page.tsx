import { Metadata } from "next";
import { ProviderGearTable } from "../../_components/provider/gear/ProviderGearTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const metadata: Metadata = {
	title: "My Gear | GearUp Provider",
	description: "Manage your rental inventory and listings.",
};

const MyGearsPage = () => {
	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						My Gear
					</h1>
					<p className="text-muted-foreground">
						View, edit, and manage all your listed rental equipment.
					</p>
				</div>
				<Link href="/provider-dashboard/add-gear">
					<Button>
						<PlusCircle className="mr-2 h-4 w-4" />
						Add New Gear
					</Button>
				</Link>
			</div>
			<ProviderGearTable />
		</div>
	);
};

export default MyGearsPage;
