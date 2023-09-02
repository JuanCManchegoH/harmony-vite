import { Dialog, Transition } from "@headlessui/react";
import { Square2StackIcon } from "@heroicons/react/24/solid";
import { Button } from "@tremor/react";
import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import { IconType } from "./CustomToggle";
import Toggle from "./Toggle";

export default function CenteredModal({
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
	const cancelButtonRef = useRef(null);
	const [enabled, setEnabled] = useState(disabled || false);

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-20"
				initialFocus={cancelButtonRef}
				onClose={setOpen}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-20 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform  rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
								<div className="mb-2">
									<div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
										{/* icon or default icon */}
										{Icon ? (
											<Icon className="h-6 w-6 text-sky-600" />
										) : (
											<Square2StackIcon className="h-6 w-6 text-sky-600" />
										)}
									</div>
									<div className="mt-2 text-center">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900"
										>
											{title}
										</Dialog.Title>
										<div className="mt-2">{children}</div>
									</div>
								</div>
								{action && (
									<div className="pt-2 border-t">
										<Toggle
											enabled={enabled}
											setEnabled={setEnabled}
											label="Confirmar"
											description="¿Estás seguro de realizar esta acción?"
										/>
										<div className="mt-2 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
											<Button
												type="button"
												color="gray"
												size="xs"
												variant="secondary"
												onClick={() => setOpen(false)}
											>
												Cancelar
											</Button>

											<Button
												type="submit"
												color="sky"
												size="xs"
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
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
