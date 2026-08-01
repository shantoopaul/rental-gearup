import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function PaymentCancelPage() {
	return (
		<div className="flex min-h-[calc(100vh-16rem)] items-center justify-center bg-muted/30 p-4">
			<Card className="max-w-md w-full text-center">
				<CardHeader>
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
						<XCircle className="h-6 w-6 text-destructive" />
					</div>
					<CardTitle className="text-2xl">
						Payment Cancelled
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Your payment was not processed. Your rental order is
						still in the system but unpaid. You can try again or
						cancel the order from your dashboard.
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-3">
					<Link href="/dashboard/my-orders" className="w-full">
						<Button className="w-full">View My Orders</Button>
					</Link>
					<Link href="/gear" className="w-full">
						<Button variant="outline" className="w-full">
							Back to Gear
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
