"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./Sidebar";
import { Role } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";

interface MobileMenuButtonsProps {
	userRole: Role;
}

export function MobileMenuButtons({ userRole }: MobileMenuButtonsProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button
				variant="outline"
				size="icon"
				className="shrink-0"
				onClick={() => setOpen(true)}
			>
				<Menu className="h-5 w-5" />
				<span className="sr-only">Toggle navigation menu</span>
			</Button>

			<AnimatePresence>
				{open && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
							onClick={() => setOpen(false)}
						/>
						<motion.aside
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{
								type: "spring",
								damping: 25,
								stiffness: 200,
							}}
							className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r shadow-xl"
						>
							<div className="flex h-16 items-center justify-between border-b px-6">
								<h2 className="text-lg font-semibold text-primary">
									GearUp
								</h2>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setOpen(false)}
								>
									<X className="h-5 w-5" />
								</Button>
							</div>
							<Sidebar
								userRole={userRole}
								onLinkClick={() => setOpen(false)}
							/>
						</motion.aside>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
