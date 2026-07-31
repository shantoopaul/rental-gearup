import Link from "next/link";
import { SearchX } from "lucide-react";
import { PulsatingButton } from "@/components/ui/pulsating-button";

const NotFound = () => {
	return (
		<div className="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center bg-muted/30 p-5 md:p-8 text-center">
			<div className="bg-background rounded-full p-6 mb-6 shadow-sm border">
				<SearchX className="h-12 w-12 text-destructive" />
			</div>
			<h1 className="text-4xl font-bold tracking-tight mb-4">
				Page Not Found
			</h1>
			<p className="text-muted-foreground max-w-md mb-8 text-lg">
				Sorry, we couldn&apos;t find the page you were looking for. It
				might have been moved or doesn&apos;t exist.
			</p>
			<Link href="/">
				<PulsatingButton>Back to Home</PulsatingButton>
			</Link>
		</div>
	);
};

export default NotFound;
