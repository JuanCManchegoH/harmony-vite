import classNames from "../utils/classNames";

export default function Avatar({
	title,
	letter,
	size,
}: {
	title: string;
	letter: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
	return (
		<div
			className={classNames(
				"inline-flex items-center justify-center rounded-full bg-rose-500 border-2 border-rose-600",
				size === "xs"
					? "h-5 w-5"
					: size === "sm"
					? "h-6 w-6"
					: size === "md"
					? "h-7 w-7"
					: size === "lg"
					? "h-8 w-8"
					: size === "xl"
					? "h-9 w-9"
					: "h-5 w-5",
			)}
			title={title}
		>
			<span
				className={classNames(
					"leading-none text-white font-pacifico uppercase",
					size === "xs" || size === "sm" || size === "md"
						? "text-xs"
						: "text-sm",
				)}
			>
				{letter}
			</span>
		</div>
	);
}
