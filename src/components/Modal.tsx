import { Dialog, Switch, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@tremor/react";
import React, { Fragment, useState } from "react";
import classNames from "../utils/classNames";

export default function Modal({
	open,
	setOpen,
	title,
	btnText,
	disabled,
	children,
	action,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	title: string;
	btnText?: string;
	disabled?: boolean;
	children: React.ReactNode;
	action?: Function;
}) {
	const [enabled, setEnabled] = useState(disabled || false);
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-20" onClose={setOpen}>
				<div className="fixed inset-0" />

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
									<div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
										<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
											<div className="px-4 border-b py-4 bg-gray-900">
												<div className="flex items-start justify-between">
													<Dialog.Title className="text-base font-semibold leading-6 text-gray-50">
														{title}
													</Dialog.Title>
													<div className="ml-3 flex h-7 items-center">
														<button
															type="button"
															className="relative rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
															onClick={() => setOpen(false)}
														>
															<span className="absolute -inset-2.5" />
															<span className="sr-only">Close panel</span>
															<XMarkIcon
																className="h-6 w-6"
																aria-hidden="true"
															/>
														</button>
													</div>
												</div>
											</div>
											<div className="relative mt-4 flex-1 px-4">
												{children}
											</div>
										</div>
										{action && (
											<div className="px-4 py-4">
												<Switch.Group
													as="div"
													className="flex items-center justify-between"
												>
													<span className="flex flex-grow flex-col">
														<Switch.Label
															as="span"
															className="text-sm font-medium leading-6 text-gray-900"
															passive
														>
															Confirmar
														</Switch.Label>
														<Switch.Description
															as="span"
															className="text-sm text-gray-500"
														>
															¿Estás seguro de realizar esta acción?
														</Switch.Description>
													</span>
													<Switch
														checked={enabled}
														onChange={setEnabled}
														className={classNames(
															enabled ? "bg-sky-500" : "bg-gray-200",
															"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
														)}
													>
														<span className="sr-only">Use setting</span>
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
																	"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
																)}
																aria-hidden="true"
															>
																<svg
																	className="h-3 w-3 text-gray-400"
																	fill="none"
																	viewBox="0 0 12 12"
																>
																	<title>Off</title>
																	<path
																		d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
																		stroke="currentColor"
																		strokeWidth={2}
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	/>
																</svg>
															</span>
															<span
																className={classNames(
																	enabled
																		? "opacity-100 duration-200 ease-in"
																		: "opacity-0 duration-100 ease-out",
																	"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
																)}
																aria-hidden="true"
															>
																<svg
																	className="h-3 w-3 text-sky-500"
																	fill="currentColor"
																	viewBox="0 0 12 12"
																>
																	<title>On</title>
																	<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
																</svg>
															</span>
														</span>
													</Switch>
												</Switch.Group>
												<div className="flex flex-shrink-0 justify-end">
													<Button
														type="button"
														color="gray"
														variant="secondary"
														onClick={() => setOpen(false)}
													>
														Cancel
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
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
