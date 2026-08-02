import { z } from "zod";

export const gearSchema = z.object({
	title: z.string().min(2, "Title must be at least 2 characters").max(200),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters"),
	brand: z.string().min(1, "Brand is required"),
	pricePerDay: z.number().positive("Price must be greater than 0"),
	quantity: z.number().int().positive("Quantity must be greater than 0"),
	images: z
		.array(z.string().url("Must be a valid URL"))
		.min(1, "At least one image is required"),
	categoryId: z.string().uuid("Please select a category"),
});

export type GearInput = z.infer<typeof gearSchema>;
