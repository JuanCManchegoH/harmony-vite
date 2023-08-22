import classNames from "../utils/classNames";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={classNames(
				"animate-pulse rounded-md bg-muted bg-gray-200",
				className || "",
			)}
			{...props}
		/>
	);
}

export { Skeleton };

export function SkeletonDemo({
	parentClassName,
	childClassName,
}: {
	parentClassName?: string;
	childClassName?: string;
}) {
	return (
		<div
			className={classNames(
				"flex items-center space-x-4 w-full",
				parentClassName || "",
			)}
		>
			<Skeleton className="h-12 w-12 rounded-full" />
			<div className="space-y-2 w-full">
				<Skeleton className={classNames("h-4", childClassName || "")} />
				<Skeleton className={classNames("h-4", childClassName || "")} />
			</div>
		</div>
	);
}
