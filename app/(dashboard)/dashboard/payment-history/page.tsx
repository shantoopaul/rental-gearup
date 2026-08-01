import { Metadata } from "next";
import { PaymentsTable } from "../../_components/customer/payment_history/PaymentsTable";

export const metadata: Metadata = {
	title: "Payment History | GearUp",
	description: "View your rental payment history and transactions.",
};

export default function PaymentHistoryPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Payment History
				</h1>
				<p className="text-muted-foreground">
					Track all your past transactions and payment statuses.
				</p>
			</div>
			<PaymentsTable />
		</div>
	);
}
