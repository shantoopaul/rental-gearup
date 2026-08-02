"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

const Error = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			<Card className="max-w-md w-full text-center">
				<CardHeader>
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
						<AlertTriangle className="h-6 w-6 text-destructive" />
					</div>
					<CardTitle className="text-2xl">
						Something went wrong!
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground mb-2">
						We encountered an unexpected error while loading this
						page.
					</p>
					{error.digest && (
						<p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
							Error ID: {error.digest}
						</p>
					)}
				</CardContent>
				<CardFooter className="flex flex-col gap-3">
					<Button onClick={() => reset()} className="w-full">
						Try Again
					</Button>
					<Button
						variant="outline"
						className="w-full"
						onClick={() => (window.location.href = "/")}
					>
						Back to Home
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Error;
