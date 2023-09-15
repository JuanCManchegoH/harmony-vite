import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Button, Color } from "@tremor/react";
import { Fragment } from "react";
import classNames from "../utils/classNames";

export interface DropDownProps {
	children: React.ReactNode;
	btnText: string;
	className?: string;
	position?: "left" | "right";
	info?: boolean;
}

export interface DropDownItemProps {
	children: React.ReactNode;
	icon?: React.ElementType;
	onClick: Function;
	position?: "left" | "right";
}

const Dropdown = ({
	children,
	btnText,
	className,
	position,
	info,
}: DropDownProps) => {
	const positionClass = position
		? position === "left"
			? "left-0"
			: "right-0"
		: "";
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button
					className={classNames(
						"inline-flex justify-center items-end w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-50",
						className || "",
					)}
				>
					{btnText}
					{!info && (
						<ChevronDownIcon className="ml-1 h-4 w-4" aria-hidden="true" />
					)}
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
				<Menu.Items
					className={classNames(
						position ? positionClass : "left-0",
						"origin-top-right absolute mt-2 rounded-md shadow-lg bg-gray-50 ring-1 ring-black ring-opacity-5 focus:outline-none z-20",
					)}
				>
					<div className="flex flex-col p-1 gap-1">{children}</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const InfoDropdownItem = ({
	children,
	btnText,
	className,
	position,
}: DropDownProps) => {
	const positionClass = position
		? position === "left"
			? "left-0"
			: "right-0"
		: "";
	return (
		<Menu as="div" className="relative inline-block text-left w-full">
			<Menu.Button className={className}>{btnText}</Menu.Button>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items
					className={classNames(
						position ? positionClass : "left-0",
						"origin-top-right absolute mt-2 rounded-md shadow-lg bg-gray-50 ring-1 ring-black ring-opacity-5 focus:outline-none z-20",
					)}
				>
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

const InfoItem = ({
	children,
	color,
}: { children: React.ReactNode; color: Color }) => {
	return (
		<Menu.Item>
			{() => (
				<Button
					color={color}
					variant="secondary"
					className="w-full flex justify-start"
				>
					{children}
				</Button>
			)}
		</Menu.Item>
	);
};

export { Dropdown, DropdownItem, InfoDropdownItem, InfoItem };
