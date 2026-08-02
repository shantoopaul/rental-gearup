"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useAdminUsers } from "@/app/(dashboard)/_hooks/useAdminUsers";
import { updateUserStatus } from "@/app/(dashboard)/_actions/adminActions";
import { toast } from "sonner";
import { useTransition, useState, useMemo } from "react";
import {
	ShieldAlert,
	UserCheck,
	UserX,
	Mail,
	Search,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { UserStatus } from "@/lib/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { UserStatusBadge } from "./UserStatusBadge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

interface AdminUsersTableProps {
	limit?: number;
	enableSearchAndPagination?: boolean;
}

export const AdminUsersTable = ({
	limit,
	enableSearchAndPagination = false,
}: AdminUsersTableProps) => {
	const { users, isLoading, isError, mutate } = useAdminUsers();
	const [isPending, startTransition] = useTransition();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		userId: string;
		userName: string;
		newStatus: UserStatus;
	}>({ open: false, userId: "", userName: "", newStatus: "ACTIVE" });

	const handleStatusUpdate = async () => {
		startTransition(async () => {
			const result = await updateUserStatus(
				confirmDialog.userId,
				confirmDialog.newStatus,
			);
			if (result.success) {
				toast.success(result.message);
				mutate();
			} else {
				toast.error(result.message);
			}
			setConfirmDialog((prev) => ({ ...prev, open: false }));
		});
	};

	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return users;
		const query = searchQuery.toLowerCase();
		return users.filter(
			(user) =>
				user.name.toLowerCase().includes(query) ||
				user.email.toLowerCase().includes(query) ||
				user.role.toLowerCase().includes(query),
		);
	}, [users, searchQuery]);

	const paginatedUsers = useMemo(() => {
		if (limit) return filteredUsers.slice(0, limit);
		if (!enableSearchAndPagination) return filteredUsers;

		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
	}, [
		filteredUsers,
		limit,
		currentPage,
		enableSearchAndPagination,
		itemsPerPage,
	]);

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

	if (isLoading) return <AdminUsersTableSkeleton />;

	if (isError)
		return (
			<EmptyState
				icon={ShieldAlert}
				title="Failed to load users"
				description="There was an error fetching the platform users. Please try again later."
				className="border-destructive/50 bg-destructive/5"
			/>
		);

	if (users.length === 0)
		return (
			<EmptyState
				icon={UserCheck}
				title="No users found"
				description="There are currently no registered users on the platform."
			/>
		);

	return (
		<>
			{enableSearchAndPagination && (
				<div className="flex items-center gap-4 mb-4">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search by name, email, or role..."
							className="pl-9"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1);
							}}
						/>
					</div>
					<p className="text-sm text-muted-foreground whitespace-nowrap">
						Showing {paginatedUsers.length} of{" "}
						{filteredUsers.length} users
					</p>
				</div>
			)}

			<div className="rounded-md border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Joined</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedUsers.length > 0 ? (
							paginatedUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-medium">
												{user.name}
											</span>
											<span className="flex items-center gap-1 text-xs text-muted-foreground">
												<Mail className="h-3 w-3" />
												{user.email}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className="capitalize"
										>
											{user.role.toLowerCase()}
										</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatDate(user.createdAt)}
									</TableCell>
									<TableCell>
										<UserStatusBadge status={user.status} />
									</TableCell>
									<TableCell className="text-right">
										{user.status === "ACTIVE" ? (
											<Button
												size="sm"
												variant="destructive"
												disabled={isPending}
												onClick={() =>
													setConfirmDialog({
														open: true,
														userId: user.id,
														userName: user.name,
														newStatus: "SUSPENDED",
													})
												}
											>
												<UserX className="h-4 w-4 mr-1" />{" "}
												Suspend
											</Button>
										) : (
											<Button
												size="sm"
												variant="outline"
												disabled={isPending}
												onClick={() =>
													setConfirmDialog({
														open: true,
														userId: user.id,
														userName: user.name,
														newStatus: "ACTIVE",
													})
												}
											>
												<UserCheck className="h-4 w-4 mr-1" />{" "}
												Activate
											</Button>
										)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-24 text-center text-muted-foreground"
								>
									No users match your search criteria.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{enableSearchAndPagination && totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-6">
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentPage((prev) => Math.max(prev - 1, 1))
						}
						disabled={currentPage <= 1}
					>
						<ChevronLeft className="h-4 w-4 mr-1" /> Previous
					</Button>
					<span className="text-sm text-muted-foreground px-4">
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentPage((prev) =>
								Math.min(prev + 1, totalPages),
							)
						}
						disabled={currentPage >= totalPages}
					>
						Next <ChevronRight className="h-4 w-4 ml-1" />
					</Button>
				</div>
			)}

			<ConfirmDialog
				open={confirmDialog.open}
				onOpenChange={(open) =>
					setConfirmDialog((prev) => ({ ...prev, open }))
				}
				title={
					confirmDialog.newStatus === "SUSPENDED"
						? "Suspend User?"
						: "Activate User?"
				}
				description={
					confirmDialog.newStatus === "SUSPENDED"
						? `Are you sure you want to suspend ${confirmDialog.userName}? They will no longer be able to log in or perform actions on the platform.`
						: `Are you sure you want to reactivate ${confirmDialog.userName}? They will regain full access to the platform.`
				}
				confirmText={
					confirmDialog.newStatus === "SUSPENDED"
						? "Suspend"
						: "Activate"
				}
				onConfirm={handleStatusUpdate}
				isLoading={isPending}
				variant={
					confirmDialog.newStatus === "SUSPENDED"
						? "destructive"
						: "default"
				}
			/>
		</>
	);
};

const AdminUsersTableSkeleton = () => {
	return (
		<div className="rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>User</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Joined</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, i) => (
						<TableRow key={i}>
							<TableCell>
								<div className="flex flex-col gap-1">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-40" />
								</div>
							</TableCell>
							<TableCell>
								<Skeleton className="h-5 w-16 rounded-full" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-24" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-5 w-20 rounded-full" />
							</TableCell>
							<TableCell className="text-right">
								<Skeleton className="h-8 w-24 ml-auto" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
