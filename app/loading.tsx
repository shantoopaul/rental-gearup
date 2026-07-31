import { SpinningText } from "@/components/ui/spinning-text";

const Loading = () => {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-5 md:p-8">
			<SpinningText>loading • rental gearup •</SpinningText>
		</div>
	);
};

export default Loading;
