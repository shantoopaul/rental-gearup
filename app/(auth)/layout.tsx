const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-5 md:p-8">
			{children}
		</main>
	);
};

export default AuthLayout;
