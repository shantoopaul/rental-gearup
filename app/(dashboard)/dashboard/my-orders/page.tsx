import { Metadata } from "next";
import { OrdersTable } from "../../_components/customer/my_orders/OrdersTable";

export const metadata: Metadata = {
	title: "My Orders | GearUp",
	description: "View and manage your rental orders.",
};

export default function MyOrdersPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
				<p className="text-muted-foreground">
					Track the status of your gear rentals and manage payments.
				</p>
			</div>
			<OrdersTable />
		</div>
	);
}
