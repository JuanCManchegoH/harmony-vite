import { Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Loading({
	show,
	text,
}: {
	show: boolean;
	text: string;
}) {
	return (
		<Transition
			show={show}
			as={Fragment}
			enter="transform ease-out duration-300 transition"
			enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
			enterTo="translate-y-0 opacity-100 sm:translate-x-0"
			leave="transition ease-in duration-100"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="w-full max-w-xs rounded-md bg-gray-50 shadow-lg ring-1 ring-black ring-opacity-5 absolute left-4 bottom-4">
				<div className="p-4">
					<div className="flex">
						<div className="flex">
							<svg
								className="animate-spin  -ml-1 h-5 w-5 text-rose-500"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Loading</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									/>
								</path>
							</svg>
						</div>
						<div className="ml-3 w-0 flex-1 pt-0.5">
							<p className="text-sm font-medium text-gray-900">{text}</p>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	);
}
