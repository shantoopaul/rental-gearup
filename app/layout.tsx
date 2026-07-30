import "./globals.css";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({subsets:['latin'],variable:'--font-sans'});

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<html lang="en" className={cn("font-sans", montserrat.variable)}>
			<body>{children}</body>
		</html>
	);
};

export default RootLayout;
