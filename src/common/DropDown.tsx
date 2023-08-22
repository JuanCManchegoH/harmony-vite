import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Button } from "@tremor/react";
import { Fragment } from "react";
import classNames from "../utils/classNames";

export interface DropDownProps {
	children: React.ReactNode;
	btnText: string;
	className?: string;
}

export interface DropDownItemProps {
	children: React.ReactNode;
	icon?: React.ElementType;
	onClick: Function;
}

const Dropdown = ({ children, btnText, className }: DropDownProps) => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button
					className={classNames(
						"inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50",
						className || "",
					)}
				>
					{btnText}
					<ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="origin-top-right absolute left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="flex flex-col p-1 gap-1">{children}</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const DropdownItem = ({ children, onClick, icon }: DropDownItemProps) => {
	return (
		<Menu.Item>
			{() => (
				<Button
					icon={icon}
					color="sky"
					variant="secondary"
					onClick={() => onClick()}
					className="w-full flex justify-start"
				>
					{children}
				</Button>
			)}
		</Menu.Item>
	);
};

export { Dropdown, DropdownItem };
