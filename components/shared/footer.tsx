import Link from "next/link";

const Footer = () => {
	return (
		<footer className="w-full border-t bg-background py-8 md:py-12">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="space-y-4">
						<Link
							href="/"
							className="flex items-center gap-2 font-bold text-xl text-primary"
						>
							Rental GearUp
						</Link>
						<p className="text-sm text-muted-foreground max-w-xs">
							Rent sports and outdoor gear instantly. Quality
							equipment for your next adventure, delivered to your
							door.
						</p>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Explore</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/gear"
									className="hover:text-primary transition-colors"
								>
									Browse Gear
								</Link>
							</li>
							<li>
								<Link
									href="/how-it-works"
									className="hover:text-primary transition-colors"
								>
									How It Works
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="hover:text-primary transition-colors"
								>
									About Us
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Support</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/contact"
									className="hover:text-primary transition-colors"
								>
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="hover:text-primary transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-primary transition-colors"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Legal</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/privacy"
									className="hover:text-primary transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-primary transition-colors"
								>
									Terms & Conditions
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
					<p>
						&copy; {new Date().getFullYear()} Rental GearUp. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
