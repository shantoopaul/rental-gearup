import Link from "next/link";
import LoginForm from "../_components/LoginForm";
import { Suspense } from "react";

const LoginPage = () => {
	return (
		<div className="space-y-2 text-center">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Welcome back
				</h1>
				<p className="text-muted-foreground">
					Enter your credentials to access your account
				</p>
			</div>
			<Suspense>
				<LoginForm />
			</Suspense>
			<p className="text-center text-sm text-muted-foreground">
				Don&apos;t have an account?{" "}
				<Link
					href="/register"
					className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
				>
					Sign up
				</Link>
			</p>
		</div>
	);
};

export default LoginPage;
