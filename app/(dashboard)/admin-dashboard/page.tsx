import { Metadata } from "next";
import AdminDashboardOverview from "../_components/admin/AdminDashboardOverview";

export const metadata: Metadata = {
	title: "Admin Dashboard | GearUp",
	description: "Platform overview and user management.",
};

const AdminDashboardPage = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Admin Dashboard
				</h1>
				<p className="text-muted-foreground">
					Welcome back! Here is an overview of the GearUp platform.
				</p>
			</div>
			<AdminDashboardOverview />
		</div>
	);
};

export default AdminDashboardPage;
