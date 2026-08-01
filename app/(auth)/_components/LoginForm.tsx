"use client";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginUser } from "../_actions/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

const LoginForm = () => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (data: LoginInput) => {
		startTransition(async () => {
			const result = await loginUser(data);

			if (result.success && result.data) {
				toast.success(result.message);
				const role = result.data.user.role;
				const fallback =
					role === "ADMIN"
						? "/admin-dashboard"
						: role === "PROVIDER"
							? "/provider-dashboard"
							: "/dashboard";
				router.push(callbackUrl || fallback);
			} else {
				toast.error(result.message || "Login failed");
			}
		});
	};

	return (
		<Card className="py-6">
			<form onSubmit={handleSubmit(onSubmit)}>
				<CardContent className="space-y-6 px-5">
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
				</CardContent>
				<CardFooter className="mt-6 flex flex-col gap-4">
					<Button
						type="submit"
						className="w-full p-5"
						disabled={isPending}
					>
						{isPending ? "Logging in..." : "Log In"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
};

export default LoginForm;
