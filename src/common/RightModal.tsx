import { Transition } from "@headlessui/react";
import { ListBulletIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Title } from "@tremor/react";
import React, {
	Dispatch,
	Fragment,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { IconType } from "./CustomToggle";
import Toggle from "./Toggle";

export default function RightModal({
	open,
	setOpen,
	icon: Icon,
	title,
	btnText,
	disabled,
	children,
	action,
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	icon?: IconType;
	title: string;
	btnText?: string;
	disabled?: boolean;
	children: React.ReactNode;
	action?: Function;
}) {
	const [enabled, setEnabled] = useState(disabled || false);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", handleEscape);
		return () => {
			window.removeEventListener("keydown", handleEscape);
		};
	}, [setOpen]);

	return (
		<Transition.Root show={open} as={Fragment}>
			<section className="relative z-20">
				<div className="fixed inset-0" />
				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden bg-gray-800 bg-opacity-20">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-400"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-400"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<div className="pointer-events-auto w-screen max-w-2xl">
									<div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
										<div className="flex min-h-0 flex-1 flex-col">
											<div className="flex items-center px-4 border-b py-4 bg-gray-50 gap-2 sticky top-0 z-10">
												{/* icon or default icon */}
												{Icon ? (
													<Icon className="h-6 w-6 text-sky-600" />
												) : (
													<ListBulletIcon className="h-6 w-6 text-sky-600" />
												)}
												<Title className="text-base font-semibold leading-6 text-sky-700 uppercase">
													{title}
												</Title>
												<XMarkIcon
													className="absolute top-4 right-4 h-6 w-6 text-gray-400 cursor-pointer"
													onClick={() => setOpen(false)}
												/>
											</div>
											<div className="h-4 bg-gray-50" />
											<div className="relative flex-1 px-4 bg-gray-50 overflow-y-auto">
												{children}
											</div>
											<div className="h-4 bg-gray-50" />
										</div>
										{action && (
											<div className="px-4 py-4 bg-gray-50">
												<Toggle
													enabled={enabled}
													setEnabled={setEnabled}
													label="Confirmar"
													description="¿Estás seguro de realizar esta acción?"
												/>
												<div className="flex flex-shrink-0 justify-end">
													<Button
														type="button"
														color="gray"
														variant="secondary"
														onClick={() => setOpen(false)}
													>
														Cancelar
													</Button>

													<Button
														type="submit"
														color="sky"
														disabled={!enabled}
														onClick={() => {
															action();
															setEnabled(false);
														}}
														className="ml-4"
													>
														{btnText || "Guardar"}
													</Button>
												</div>
											</div>
										)}
									</div>
								</div>
							</Transition.Child>
						</div>
					</div>
				</div>
			</section>
		</Transition.Root>
	);
}
