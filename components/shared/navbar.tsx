"use client";

import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const navLinks = [
		{ href: "/", label: "Home" },
		{ href: "/gear", label: "Browse Gear" },
		{ href: "/how-it-works", label: "How It Works" },
		{ href: "/about", label: "About" },
		{ href: "/contact", label: "Contact" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link
					href="/"
					className="flex items-center gap-2 font-bold text-xl text-primary"
				>
					<span className="text-2xl">🏋️</span>
					GearUp
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-6">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Desktop Auth Buttons */}
				<div className="hidden md:flex items-center gap-4">
					<Button variant="ghost">
						<Link href="/auth/login">Log In</Link>
					</Button>
					<Button>
						<Link href="/auth/register">Sign Up</Link>
					</Button>
				</div>

				{/* Mobile Menu Button */}
				<button
					className="md:hidden p-2 text-muted-foreground"
					onClick={() => setIsOpen(!isOpen)}
					aria-label="Toggle menu"
				>
					{isOpen ? (
						<X className="h-6 w-6" />
					) : (
						<Menu className="h-6 w-6" />
					)}
				</button>
			</div>

			{/* Mobile Navigation */}
			{isOpen && (
				<div className="md:hidden border-t bg-background px-4 py-4 space-y-4">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="block text-sm font-medium text-muted-foreground hover:text-primary"
							onClick={() => setIsOpen(false)}
						>
							{link.label}
						</Link>
					))}
					<div className="flex flex-col gap-2 pt-4 border-t">
						<Button
							variant="outline"
							className="w-full justify-start"
						>
							<Link
								href="/auth/login"
								onClick={() => setIsOpen(false)}
							>
								<User className="mr-2 h-4 w-4" /> Log In
							</Link>
						</Button>
						<Button className="w-full justify-start">
							<Link
								href="/auth/register"
								onClick={() => setIsOpen(false)}
							>
								Sign Up
							</Link>
						</Button>
					</div>
				</div>
			)}
		</header>
	);
}
