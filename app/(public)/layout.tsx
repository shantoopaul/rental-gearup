import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/sonner";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Toaster />
			<Navbar />
			<main className="flex-1">{children}</main>
			<Footer />
		</>
	);
};

export default PublicLayout;
