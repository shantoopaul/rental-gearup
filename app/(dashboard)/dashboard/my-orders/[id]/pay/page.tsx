import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { initiatePayment } from "@/app/(dashboard)/_actions/paymentActions";
import { CreditCard, ShieldCheck, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
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
		return null;
	}
};

export default async function PayOrderPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const order = await getRentalOrder(id);

	if (!order) {
		notFound();
	}

	// Prevent access to checkout if the order isn't confirmed by the provider yet
	if (order.status !== "CONFIRMED") {
		redirect(`/dashboard/my-orders/${id}`);
	}

	const startDate = new Date(order.startDate).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
	const endDate = new Date(order.endDate).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
	const days = Math.ceil(
		(new Date(order.endDate).getTime() -
			new Date(order.startDate).getTime()) /
			(1000 * 60 * 60 * 24),
	);

	const payAction = initiatePayment.bind(null, order.id);

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="flex items-center gap-4">
				<Link href={`/dashboard/my-orders/${id}`}>
					<Button variant="outline" size="icon-sm">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
			</div>

			<Card className="border-2 border-primary/20 shadow-lg">
				<CardHeader>
					<CardTitle>Order Summary</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
						<div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden relative shrink-0">
							{order.gearItem.images?.[0] ? (
								<img
									src={order.gearItem.images[0]}
									alt={order.gearItem.title}
									className="object-cover h-full w-full"
								/>
							) : (
								<Package className="h-8 w-8 text-muted-foreground" />
							)}
						</div>
						<div className="flex-1">
							<h3 className="font-semibold">
								{order.gearItem.title}
							</h3>
							<p className="text-sm text-muted-foreground">
								{startDate} - {endDate} • Qty: {order.quantity}
							</p>
						</div>
					</div>

					<div className="space-y-3 pt-4 border-t">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">
								${Number(order.gearItem.pricePerDay).toFixed(2)}{" "}
								× {order.quantity} items × {days} days
							</span>
							<span>${Number(order.totalPrice).toFixed(2)}</span>
						</div>
						<div className="flex justify-between font-bold text-lg pt-2 border-t">
							<span>Total Due</span>
							<span className="text-primary">
								${Number(order.totalPrice).toFixed(2)}
							</span>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<form action={payAction} className="w-full">
						<Button type="submit" size="lg" className="w-full">
							<CreditCard className="mr-2 h-5 w-5" /> Proceed to
							Stripe Checkout
						</Button>
					</form>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<ShieldCheck className="h-4 w-4" />
						<span>Secure payment processed via Stripe</span>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
