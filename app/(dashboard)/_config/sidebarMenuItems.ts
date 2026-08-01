import {
	LayoutDashboard,
	Package,
	ShoppingCart,
	Users,
	Settings,
	CreditCard,
	Star,
	PlusCircle,
	ListOrdered,
} from "lucide-react";
import { Role } from "@/lib/types";

export interface SidebarItem {
	title: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	roles: Role[];
}

export const sidebarItems: SidebarItem[] = [
	{
		title: "Overview",
		href: "/dashboard",
		icon: LayoutDashboard,
		roles: ["CUSTOMER"],
	},
	{
		title: "My Orders",
		href: "/dashboard/my-orders",
		icon: ShoppingCart,
		roles: ["CUSTOMER"],
	},
	{
		title: "Payment History",
		href: "/dashboard/payment-history",
		icon: CreditCard,
		roles: ["CUSTOMER"],
	},
	{
		title: "My Reviews",
		href: "/dashboard/my-reviews",
		icon: Star,
		roles: ["CUSTOMER"],
	},

	{
		title: "Overview",
		href: "/provider-dashboard",
		icon: LayoutDashboard,
		roles: ["PROVIDER"],
	},
	{
		title: "Add Gear",
		href: "/provider-dashboard/add-gear",
		icon: PlusCircle,
		roles: ["PROVIDER"],
	},
	{
		title: "My Gears",
		href: "/provider-dashboard/my-gears",
		icon: Package,
		roles: ["PROVIDER"],
	},
	{
		title: "Incoming Orders",
		href: "/provider-dashboard/my-orders",
		icon: ListOrdered,
		roles: ["PROVIDER"],
	},

	{
		title: "Overview",
		href: "/admin-dashboard",
		icon: LayoutDashboard,
		roles: ["ADMIN"],
	},
	{
		title: "Users",
		href: "/admin-dashboard/users",
		icon: Users,
		roles: ["ADMIN"],
	},
	{
		title: "All Gears",
		href: "/admin-dashboard/gears",
		icon: Package,
		roles: ["ADMIN"],
	},
	{
		title: "All Orders",
		href: "/admin-dashboard/orders",
		icon: ShoppingCart,
		roles: ["ADMIN"],
	},
	{
		title: "Categories",
		href: "/admin-dashboard/add-category",
		icon: Settings,
		roles: ["ADMIN"],
	},
];
