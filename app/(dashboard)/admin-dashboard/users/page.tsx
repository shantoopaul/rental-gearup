import { Metadata } from "next";
import { AdminUsersTable } from "../../_components/admin/AdminUsersTable";

export const metadata: Metadata = {
	title: "User Management | GearUp Admin",
	description: "Manage platform users, suspend or activate accounts.",
};

const AdminUsersPage = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					User Management
				</h1>
				<p className="text-muted-foreground">
					View, search, and manage all registered users on the
					platform.
				</p>
			</div>
			<AdminUsersTable enableSearchAndPagination />
		</div>
	);
};

export default AdminUsersPage;
