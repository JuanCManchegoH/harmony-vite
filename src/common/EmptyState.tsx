export default function EmptyState({
	children,
}: { children: React.ReactNode }) {
	return (
		<span className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 bg-gray-50 rounded-md text-center z-10">
			{children}
		</span>
	);
}
