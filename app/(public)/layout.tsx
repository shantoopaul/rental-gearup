import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/sonner";
import { getMe } from "@/services/getMe";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
	const user = await getMe();
	console.log(user);
	return (
		<>
			<Toaster />
			<Navbar user={user} />
			<main className="flex-1">{children}</main>
			<Footer />
		</>
	);
};

export default PublicLayout;
