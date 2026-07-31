// app/(public)/page.tsx
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ArrowRight, ShieldCheck, Clock, Star } from "lucide-react";
import FeaturedGear from "./_components/gear/FeaturedGear";
import { Suspense } from "react";
import GearGridSkeleton from "./_components/gear/GearGridSkeleton";

const HomePage = () => {
	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative py-20 md:py-32 bg-linear-to-b from-muted/50 to-background">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
						Rent Sports & Outdoor Gear{" "}
						<span className="text-primary">Instantly</span>
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
						Quality equipment for your next adventure, delivered to
						your door. Browse, book, and hit the trails without the
						hassle of ownership.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link href="/gear">
							<InteractiveHoverButton className="py-3">
								Browse Gear
							</InteractiveHoverButton>
						</Link>
						<Link href="/how-it-works">
							<button className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-3.5 text-sm font-medium transition-colors hover:bg-muted">
								How It Works{" "}
								<ArrowRight className="ml-2 h-4 w-4" />
							</button>
						</Link>
					</div>
				</div>
			</section>

			{/* Featured Gear Section */}
			<section className="py-16 md:py-24 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
						<div>
							<h2 className="text-3xl font-bold tracking-tight mb-2">
								Featured Gear
							</h2>
							<p className="text-muted-foreground max-w-2xl">
								Top-rated equipment ready for your next
								adventure.
							</p>
						</div>
						<Link href="/gear">
							<InteractiveHoverButton className="py-3">
								Explore All Gear
							</InteractiveHoverButton>
						</Link>
					</div>

					<Suspense fallback={<GearGridSkeleton />}>
						<FeaturedGear />
					</Suspense>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 md:py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold tracking-tight mb-4">
							Why Choose GearUp?
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							We make renting outdoor equipment simple,
							affordable, and reliable.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<ShieldCheck className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Quality Guaranteed
							</h3>
							<p className="text-muted-foreground">
								All gear is inspected, cleaned, and maintained
								by verified providers to ensure top performance.
							</p>
						</div>
						<div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<Clock className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Instant Booking
							</h3>
							<p className="text-muted-foreground">
								Check availability in real-time, book your
								dates, and get confirmed in seconds.
							</p>
						</div>
						<div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<Star className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Trusted Reviews
							</h3>
							<p className="text-muted-foreground">
								Make informed decisions with transparent ratings
								and reviews from fellow adventurers.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-primary text-primary-foreground">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-bold tracking-tight mb-4">
						Ready for your next adventure?
					</h2>
					<p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
						Join thousands of outdoor enthusiasts who trust GearUp
						for their equipment needs.
					</p>
					<Link href="/register">
						<button className="inline-flex items-center justify-center rounded-full bg-background text-primary px-8 py-3 text-base font-semibold transition-colors hover:bg-background/90">
							Create an Account
						</button>
					</Link>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
