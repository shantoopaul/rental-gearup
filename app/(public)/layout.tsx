import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

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
				<Navbar />
				<main className="flex-1">{children}</main>
				<Footer />
			</body>
		</html>
	);
};

export default RootLayout;
