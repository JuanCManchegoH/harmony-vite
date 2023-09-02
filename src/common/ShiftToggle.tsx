import { Switch } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import classNames from "../utils/classNames";

export default function ShiftToggle({
	enabled,
	setEnabled,
}: {
	enabled: boolean;
	setEnabled: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<Switch
			checked={enabled}
			onChange={setEnabled}
			className={classNames(
				enabled ? "bg-green-300" : "bg-gray-200",
				"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
			)}
		>
			<span
				className={classNames(
					enabled ? "translate-x-5" : "translate-x-0",
					"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
				)}
			>
				<span
					className={classNames(
						enabled
							? "opacity-0 duration-100 ease-out"
							: "opacity-100 duration-200 ease-in",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity font-rhd font-bold text-xs text-gray-600",
					)}
					aria-hidden="true"
				>
					X
				</span>
				<span
					className={classNames(
						enabled
							? "opacity-100 duration-200 ease-in"
							: "opacity-0 duration-100 ease-out",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity font-rhd font-bold text-xs text-gray-600",
					)}
					aria-hidden="true"
				>
					T
				</span>
			</span>
		</Switch>
	);
}
