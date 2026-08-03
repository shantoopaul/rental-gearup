import { Metadata } from "next";
import { AdminCategoriesTable } from "../../_components/admin/AdminCategoriesTable";

export const metadata: Metadata = {
	title: "Categories | GearUp Admin",
	description: "Manage gear categories across the platform.",
};

const AdminCategoriesPage = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Category Management
				</h1>
				<p className="text-muted-foreground">
					Create, edit, and delete gear categories to organize the
					platform inventory.
				</p>
			</div>
			<AdminCategoriesTable />
		</div>
	);
};

export default AdminCategoriesPage;
