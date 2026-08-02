import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<html
			lang="en"
			className={cn(
				"flex min-h-screen flex-col font-sans",
				montserrat.variable,
			)}
		>
			<body>
				<Toaster />
				{children}
			</body>
		</html>
	);
};

export default RootLayout;
