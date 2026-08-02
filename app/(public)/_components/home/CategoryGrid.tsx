import Link from "next/link";
import { Category } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import {
	Tent,
	Bike,
	Dumbbell,
	Compass,
	SportShoe,
	Drone,
	Car,
} from "lucide-react";

interface CategoryGridProps {
	categories: Category[];
}

const categoryIcons: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	automotives: Car,
	camping: Tent,
	bikes: Bike,
	bicycle: Bike,
	cycling: Bike,
	sports: SportShoe,
	gym: Dumbbell,
	drones: Drone,
	general: Compass,
};

const getIcon = (name: string) => {
	const lower = name.toLowerCase();
	for (const [key, Icon] of Object.entries(categoryIcons)) {
		if (lower.includes(key)) return Icon;
	}
	return Compass;
};

export function CategoryGrid({ categories }: CategoryGridProps) {
	if (categories.length === 0) return null;

	return (
		<section className="py-16 md:py-24 bg-background">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold tracking-tight mb-4">
						Shop by Category
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Find exactly what you need for your next adventure.
					</p>
				</div>
				<div className="flex flex-row gap-4 mx-auto">
					{categories.map((category) => {
						const Icon = getIcon(category.name);
						return (
							<Link
								key={category.id}
								href={`/gear?category=${encodeURIComponent(category.name)}`}
								className="w-full"
							>
								<Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group cursor-pointer">
									<CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
											<Icon className="h-6 w-6 text-primary" />
										</div>
										<span className="font-medium text-sm">
											{category.name}
										</span>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
