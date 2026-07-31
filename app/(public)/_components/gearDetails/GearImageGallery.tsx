"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GearImageGalleryProps {
	images: string[];
	title: string;
}

const GearImageGallery = ({ images, title }: GearImageGalleryProps) => {
	const [selectedImage, setSelectedImage] = useState(0);

	if (!images || images.length === 0) {
		return (
			<div className="aspect-square w-full rounded-xl bg-muted flex items-center justify-center border">
				<p className="text-muted-foreground">No images available</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted border">
				<Image
					src={images[selectedImage]}
					alt={`${title} - Image ${selectedImage + 1}`}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 50vw"
					priority
				/>
			</div>

			{images.length > 1 && (
				<div className="grid grid-cols-4 gap-4">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => setSelectedImage(index)}
							className={cn(
								"relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
								selectedImage === index
									? "border-primary ring-2 ring-primary/20"
									: "border-transparent hover:border-muted-foreground/50",
							)}
						>
							<Image
								src={image}
								alt={`${title} thumbnail ${index + 1}`}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 25vw, 10vw"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default GearImageGallery;
