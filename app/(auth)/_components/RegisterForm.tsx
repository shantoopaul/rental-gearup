"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "../_actions/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

export function RegisterForm() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "CUSTOMER",
		},
	});

	const onSubmit = (data: RegisterInput) => {
		startTransition(async () => {
			const result = await registerUser(data);
			if (result.success) {
				toast.success(result.message);
				router.push("/login?registered=true");
			} else {
				toast.error(result.message);
			}
		});
	};

	return (
		<Card className="py-6">
			<form onSubmit={handleSubmit(onSubmit)}>
				<CardContent className="space-y-6 px-5">
					<div className="space-y-3">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							placeholder="Shanto Paul"
							{...register("name")}
							disabled={isPending}
						/>
						{errors.name && (
							<p className="text-sm text-destructive -mt-3">
								{errors.name.message}
							</p>
						)}
					</div>

					<div className="space-y-3">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="shantoopaul@gmail.com"
							{...register("email")}
							disabled={isPending}
						/>
						{errors.email && (
							<p className="text-sm text-destructive -mt-3">
								{errors.email.message}
							</p>
						)}
					</div>

					<div className="space-y-3">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							{...register("password")}
							disabled={isPending}
						/>
						{errors.password && (
							<p className="text-sm text-destructive -mt-3">
								{errors.password.message}
							</p>
						)}
					</div>

					<div className="space-y-3">
						<Label htmlFor="role">I am a</Label>
						<select
							id="role"
							{...register("role")}
							disabled={isPending}
							className="flex h-9 w-full rounded-md border border-input px-2 py-1 text-sm"
						>
							<option value="CUSTOMER">Customer</option>
							<option value="PROVIDER">Provider</option>
						</select>
						{errors.role && (
							<p className="text-sm text-destructive -mt-3">
								{errors.role.message}
							</p>
						)}
					</div>
				</CardContent>
				<CardFooter className="mt-6">
					<Button
						type="submit"
						className="w-full p-5"
						disabled={isPending}
					>
						{isPending ? "Creating account..." : "Create Account"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
