import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const PaymentSuccessPage = () => {
	return (
		<div className="flex min-h-[calc(100vh-16rem)] items-center justify-center bg-muted/30 p-4">
			<Card className="max-w-md w-full text-center">
				<CardHeader>
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
						<CheckCircle2 className="h-6 w-6 text-green-600" />
					</div>
					<CardTitle className="text-2xl">
						Payment Successful!
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Your payment has been processed successfully. Your
						rental order is now confirmed and paid. You can track
						your order status in your dashboard.
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-3">
					<Link href="/dashboard/my-orders" className="w-full">
						<Button className="w-full">View My Orders</Button>
					</Link>
					<Link href="/gear" className="w-full">
						<Button variant="outline" className="w-full">
							Continue Browsing
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
};

export default PaymentSuccessPage;
