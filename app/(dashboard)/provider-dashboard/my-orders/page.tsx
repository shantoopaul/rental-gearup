import { Metadata } from "next";
import { ProviderOrdersTable } from "../../_components/provider/my_orders/ProviderOrdersTable";

export const metadata: Metadata = {
	title: "Incoming Orders | GearUp Provider",
	description: "Manage incoming rental orders for your gear.",
};

export default function ProviderOrdersPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Incoming Orders
				</h1>
				<p className="text-muted-foreground">
					Confirm, fulfill, and manage rental orders for your gear
					inventory.
				</p>
			</div>
			<ProviderOrdersTable />
		</div>
	);
}
