import { Metadata } from "next";
import { AdminOrdersTable } from "../../_components/admin/AdminOrdersTable";

export const metadata: Metadata = {
	title: "All Orders | GearUp Admin",
	description: "Inspect and moderate all rental orders across the platform.",
};

const AdminOrdersPage = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Platform Orders
				</h1>
				<p className="text-muted-foreground">
					Inspect and track all rental orders across the platform.
				</p>
			</div>
			<AdminOrdersTable enableSearchAndPagination />
		</div>
	);
};

export default AdminOrdersPage;
