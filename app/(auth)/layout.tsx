const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-5 md:p-8">
			<div className="w-full max-w-md space-y-6">{children}</div>
		</div>
	);
};

export default AuthLayout;
