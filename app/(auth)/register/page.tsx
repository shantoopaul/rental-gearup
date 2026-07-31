import Link from "next/link";
import { RegisterForm } from "../_components/RegisterForm";

export default function RegisterPage() {
	return (
		<div className="space-y-2 text-center">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Create an account
				</h1>
				<p className="text-muted-foreground">
					Enter your details below to create your GearUp account
				</p>
			</div>
			<RegisterForm />
			<p className="text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link
					href="/auth/login"
					className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
				>
					Log in
				</Link>
			</p>
		</div>
	);
}
