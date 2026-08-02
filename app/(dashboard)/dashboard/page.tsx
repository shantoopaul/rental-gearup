import { Metadata } from "next";
import DashboardOverview from "../_components/customer/DashboardOverview";

export const metadata: Metadata = {
	title: "Dashboard | GearUp",
	description: "View your rental statistics and recent orders.",
};

const CustomerDashboardPage = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Dashboard Overview
				</h1>
				<p className="text-muted-foreground">
					Welcome back! Here is a summary of your rental activity.
				</p>
			</div>
			<DashboardOverview />
		</div>
	);
};

export default CustomerDashboardPage;
