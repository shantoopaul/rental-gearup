import { Metadata } from "next";
import { AdminGearTable } from "../../_components/admin/AdminGearTable";

export const metadata: Metadata = {
	title: "All Gear | GearUp Admin",
	description: "Inspect and moderate all gear listings across the platform.",
};

const AdminGearsPage = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Platform Gear
				</h1>
				<p className="text-muted-foreground">
					Inspect and moderate all gear listings across the platform.
				</p>
			</div>
			<AdminGearTable enableSearchAndPagination />
		</div>
	);
};

export default AdminGearsPage;
