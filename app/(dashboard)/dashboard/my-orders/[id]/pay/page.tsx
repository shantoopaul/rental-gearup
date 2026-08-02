import { notFound, redirect } from "next/navigation";
import { getRentalDetails } from "@/app/(dashboard)/_actions/getRentalDetails";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	CreditCard,
	CalendarDays,
	Package,
	User,
	ShieldCheck,
} from "lucide-react";
import { initiatePayment } from "@/app/(dashboard)/_actions/paymentActions";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

const formatPrice = (price: number | string) => `$${Number(price).toFixed(2)}`;

interface PayPageProps {
	params: Promise<{ id: string }>;
}

const PayPage = async ({ params }: PayPageProps) => {
	const { id } = await params;
	const response = await getRentalDetails(id);

	if (!response.success || !response.data) {
		notFound();
	}

	const order = response.data;

	if (order.status !== "CONFIRMED") {
		redirect("/dashboard/my-orders");
	}

	const days = Math.max(
		1,
		Math.ceil(
			(new Date(order.endDate).getTime() -
				new Date(order.startDate).getTime()) /
				(1000 * 60 * 60 * 24),
		),
	);

	return (
		<div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
			<div className="mb-8 space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Complete Your Payment
				</h1>
				<p className="text-muted-foreground">
					Your rental order has been confirmed by the provider. Please
					proceed to checkout to secure your booking.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Order Summary */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Package className="h-5 w-5" />
								Order Summary
							</CardTitle>
							<CardDescription>
								Order ID: #{order.id.slice(0, 8)}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex gap-4">
								{order.gearItem?.images?.[0] && (
									<div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted border">
										<Image
											src={order.gearItem.images[0]}
											alt={order.gearItem.title}
											fill
											className="object-cover"
										/>
									</div>
								)}
								<div className="flex-1 space-y-1">
									<h3 className="font-semibold text-lg">
										{order.gearItem?.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{order.gearItem?.brand} •{" "}
										{order.gearItem?.category?.name}
									</p>
									<div className="flex items-center gap-2 pt-1">
										<Badge
											variant="outline"
											className="text-blue-600 border-blue-200 bg-blue-50"
										>
											Confirmed by Provider
										</Badge>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 pt-4 border-t">
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground flex items-center gap-1">
										<CalendarDays className="h-4 w-4" />{" "}
										Start Date
									</p>
									<p className="font-medium">
										{formatDate(order.startDate)}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground flex items-center gap-1">
										<CalendarDays className="h-4 w-4" /> End
										Date
									</p>
									<p className="font-medium">
										{formatDate(order.endDate)}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">
										Quantity
									</p>
									<p className="font-medium">
										{order.quantity} item(s)
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">
										Duration
									</p>
									<p className="font-medium">{days} day(s)</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg">
								<User className="h-5 w-5" />
								Provider Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="font-medium">
								{order.gearItem?.provider?.name ||
									"Unknown Provider"}
							</p>
							<p className="text-sm text-muted-foreground">
								{order.gearItem?.provider?.email}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Payment Action */}
				<div className="md:col-span-1">
					<Card className="sticky top-24 border-2 border-primary/20 shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl">
								Payment Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										{formatPrice(
											order.gearItem?.pricePerDay || 0,
										)}{" "}
										x {days} days x {order.quantity} item(s)
									</span>
								</div>
								<div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
									<span>Total Due</span>
									<span className="text-primary">
										{formatPrice(order.totalPrice)}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
								<ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
								<span>Secure payment processed via Stripe</span>
							</div>
						</CardContent>
						<CardFooter>
							<form
								action={initiatePayment.bind(null, order.id)}
								className="w-full"
							>
								<Button
									type="submit"
									size="lg"
									className="w-full"
								>
									<CreditCard className="mr-2 h-5 w-5" />
									Pay Now via Stripe
								</Button>
							</form>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default PayPage;
