import { ReactNode } from "react";
import classNames from "../utils/classNames";

export default function Label({
	text,
	children,
	className,
}: {
	text: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={classNames("relative", className || "")}>
			<label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900 z-10 rounded-full">
				{text}
			</label>
			{children}
		</div>
	);
}
