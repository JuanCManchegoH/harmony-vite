import { Color } from "@tremor/react";

export default function Ping({ color }: { color?: Color | undefined }) {
	return (
		<span className="absolute right-0 -top-1">
			<span className="relative flex h-2 w-2">
				<span
					className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${
						color || "sky"
					}-300 opacity-75`}
				/>
				<span
					className={`inline-flex rounded-full h-2 w-2 bg-${
						color || "sky"
					}-400`}
				/>
			</span>
		</span>
	);
}
