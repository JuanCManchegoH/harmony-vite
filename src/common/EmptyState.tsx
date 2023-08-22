export default function EmptyState({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-md text-center">
			{children}
		</div>
	);
}
