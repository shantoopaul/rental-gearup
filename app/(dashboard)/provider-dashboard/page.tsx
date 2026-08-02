import { Metadata } from "next";
import ProviderDashboardOverview from "../_components/provider/ProviderDashboardOverview";

export const metadata: Metadata = {
	title: "Provider Dashboard | GearUp",
	description: "Overview of your gear inventory and incoming rental orders.",
};

const ProviderDashboardPage = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Provider Dashboard
				</h1>
				<p className="text-muted-foreground">
					Welcome back! Here is a summary of your inventory and rental
					activity.
				</p>
			</div>
			<ProviderDashboardOverview />
		</div>
	);
};

export default ProviderDashboardPage;
