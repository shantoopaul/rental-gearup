import { GearItem } from "@/lib/types";
import { CheckCircle2, User, Mail } from "lucide-react";

interface GearInfoSectionProps {
	gear: GearItem;
}

const GearInfoSection = ({ gear }: GearInfoSectionProps) => {
	const price =
		typeof gear.pricePerDay === "string"
			? parseFloat(gear.pricePerDay)
			: gear.pricePerDay;

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
					{gear.title}
				</h1>
				<div className="flex items-baseline gap-2">
					<span className="text-3xl font-bold text-primary">
						${price.toFixed(2)}
					</span>
					<span className="text-muted-foreground">/ day</span>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Description</h2>
				<p className="text-muted-foreground leading-relaxed">
					{gear.description}
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Specifications</h2>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">Brand</p>
						<p className="font-medium">{gear.brand}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">
							Category
						</p>
						<p className="font-medium">{gear.category.name}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">
							Availability
						</p>
						<div className="flex items-center gap-2">
							{gear.isAvailable ? (
								<>
									<CheckCircle2 className="h-4 w-4 text-green-600" />
									<p className="font-medium text-green-600">
										In Stock ({gear.quantity} available)
									</p>
								</>
							) : (
								<p className="font-medium text-destructive">
									Currently Unavailable
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{gear.provider && (
				<>
					<div className="h-px bg-border" />
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">
							Provider Information
						</h2>
						<div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
								<User className="h-6 w-6 text-primary" />
							</div>
							<div>
								<p className="font-semibold">
									{gear.provider.name}
								</p>
								<div className="flex items-center gap-1 text-sm text-muted-foreground">
									<Mail className="h-3 w-3" />
									<span>{gear.provider.email}</span>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default GearInfoSection;
