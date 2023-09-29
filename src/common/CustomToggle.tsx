import { Switch } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import classNames from "../utils/classNames";

export type IconType = React.ForwardRefExoticComponent<
	React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
		title?: string;
		titleId?: string;
	} & React.RefAttributes<SVGSVGElement>
>;

export default function CustomToggle({
	enabled,
	setEnabled,
	values,
}: {
	enabled: boolean;
	setEnabled: Dispatch<SetStateAction<boolean>>;
	values: { enabled: string | IconType; disabled: string | IconType };
}) {
	return (
		<Switch
			checked={enabled}
			onChange={setEnabled}
			className={classNames(
				enabled ? "bg-sky-400" : "bg-sky-400",
				"relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
			)}
		>
			<span
				className={classNames(
					enabled ? "translate-x-8" : "translate-x-0",
					"pointer-events-none relative inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
				)}
			>
				<span
					className={classNames(
						enabled
							? "opacity-0 duration-100 ease-out"
							: "opacity-100 duration-200 ease-in",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity font-rhd font-bold text-sm text-sky-600",
					)}
					aria-hidden="true"
				>
					{typeof values.disabled === "string" ? (
						values.disabled
					) : (
						<values.disabled className="w-4 h-4 text-sky-500" />
					)}
				</span>
				<span
					className={classNames(
						enabled
							? "opacity-100 duration-200 ease-in"
							: "opacity-0 duration-100 ease-out",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity font-rhd font-bold text-sm text-sky-600",
					)}
					aria-hidden="true"
				>
					{typeof values.enabled === "string" ? (
						values.enabled
					) : (
						<values.enabled className="w-4 h-4 text-sky-500" />
					)}
				</span>
			</span>
		</Switch>
	);
}
