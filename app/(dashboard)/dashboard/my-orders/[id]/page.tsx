import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderStatusBadge } from "@/app/(dashboard)/_components/customer/my_orders/OrderStatusBadge";
import { PaymentStatusBadge } from "@/app/(dashboard)/_components/customer/payment_history/PaymentStatusBadge";
import { Calendar, Package, CreditCard, ArrowLeft } from "lucide-react";
import { RentalOrder } from "@/lib/types";

const getRentalOrder = async (id: string): Promise<RentalOrder | null> => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;
	if (!accessToken) return null;

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${apiUrl}/rentals/${id}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			cache: "no-store",
		});
		if (!res.ok) return null;
		const result = await res.json();
		return result.data;
	} catch (error) {
		console.error("getRentalOrder error:", error);
		return null;
	}
};

export default async function OrderDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const order = await getRentalOrder(id);

	if (!order) {
		notFound();
	}

	const startDate = new Date(order.startDate).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
	const endDate = new Date(order.endDate).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
	const createdAt = new Date(order.createdAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	const canPay =
		order.status === "CONFIRMED" &&
		(!order.payment || order.payment.status === "PENDING");

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/dashboard/my-orders">
					<Button variant="outline" size="icon-sm">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Order Details
					</h1>
					<p className="text-muted-foreground">
						Order ID: #{order.id.slice(0, 8)}
					</p>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Package className="h-5 w-5" /> Gear Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h3 className="font-semibold text-lg">
								{order.gearItem.title}
							</h3>
							<p className="text-sm text-muted-foreground">
								{order.gearItem.brand} •{" "}
								{order.gearItem.category.name}
							</p>
						</div>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground">
									Quantity
								</p>
								<p className="font-medium">{order.quantity}</p>
							</div>
							<div>
								<p className="text-muted-foreground">
									Price per Day
								</p>
								<p className="font-medium">
									$
									{Number(order.gearItem.pricePerDay).toFixed(
										2,
									)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" /> Rental Period
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground">
									Start Date
								</p>
								<p className="font-medium">{startDate}</p>
							</div>
							<div>
								<p className="text-muted-foreground">
									End Date
								</p>
								<p className="font-medium">{endDate}</p>
							</div>
						</div>
						<div className="pt-4 border-t">
							<p className="text-muted-foreground text-sm">
								Placed On
							</p>
							<p className="font-medium">{createdAt}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span className="flex items-center gap-2">
							<CreditCard className="h-5 w-5" /> Payment & Status
						</span>
						<OrderStatusBadge status={order.status} />
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
						<div>
							<p className="text-sm text-muted-foreground">
								Total Amount
							</p>
							<p className="text-2xl font-bold text-primary">
								${Number(order.totalPrice).toFixed(2)}
							</p>
						</div>
						{canPay && (
							<Link href={`/dashboard/my-orders/${order.id}/pay`}>
								<Button size="lg">
									<CreditCard className="mr-2 h-4 w-4" /> Pay
									Now
								</Button>
							</Link>
						)}
					</div>

					{order.payment && (
						<div className="space-y-3">
							<h3 className="font-semibold">Payment Details</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground">
										Transaction ID
									</p>
									<p className="font-mono text-xs">
										{order.payment.transactionId.slice(
											0,
											12,
										)}
										...
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">
										Method
									</p>
									<p className="capitalize">
										{order.payment.method.toLowerCase()}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">
										Status
									</p>
									<PaymentStatusBadge
										status={order.payment.status}
									/>
								</div>
								<div>
									<p className="text-muted-foreground">
										Paid At
									</p>
									<p>
										{order.payment.paidAt
											? new Date(
													order.payment.paidAt,
												).toLocaleDateString()
											: "Pending"}
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
