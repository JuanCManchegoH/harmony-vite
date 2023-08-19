import { Menu, Transition } from "@headlessui/react";
import {
	CalendarDaysIcon,
	HomeIcon,
	PresentationChartBarIcon,
} from "@heroicons/react/24/solid";
import { Player } from "@lottiefiles/react-lottie-player";
import { Tab, TabList, Title } from "@tremor/react";
import { Fragment } from "react";
import { useAppSelector } from "../hooks/store";
import { useAuth } from "../hooks/useAuth";

export const navigation = [
	{ name: "Dashboard", icon: HomeIcon },
	{ name: "Programaciones", icon: CalendarDaysIcon },
	{ name: "Seguimiento", icon: PresentationChartBarIcon },
];

export default function Navbar() {
	const profile = useAppSelector((state) => state.auth.profile);
	const { logout } = useAuth();

	return (
		<header className="fixed bg-white inset-x-0 px-2 top-0 z-10 flex justify-end items-center h-12 border-b border-gray-900/10 font-rhd">
			<div className="bg-rose-500 absolute left-2 top-1 h-fit py-1 px-2 rounded-md shadow-xl">
				<Title
					className="grid place-content-center text-2xl text-gray-50 font-pacifico"
					color="gray"
				>
					Harmony
				</Title>
			</div>
			<Player
				src="https://lottie.host/b83ec7da-2180-410c-abfd-da574078a863/1KdE2tEL0F.json"
				className="player"
				autoplay
				loop
				style={{
					height: "70px",
					width: "70px",
					position: "absolute",
					left: "77px",
					top: "-12px",
				}}
			/>
			<div className="grid place-content-center mr-4">
				<TabList
					className="flex-1 flex items-center justify-end space-x-4 border-transparent dark:border-transparent"
					color="rose"
				>
					{navigation.map((item) => (
						<Tab
							key={item.name}
							className="text-base font-bold hover:text-gray-800 dark:hover:text-gray-800 text-gray-700 dark:text-gray-700 h-12 items-center"
							icon={item.icon}
						>
							{item.name}
						</Tab>
					))}
				</TabList>
			</div>
			<Menu as="div" className="relative inline-block text-left">
				<Menu.Button
					className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500"
					title={profile.userName}
				>
					<span className="leading-none text-white font-pacifico">
						{profile.userName[0]}
					</span>
				</Menu.Button>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					{/* Logout */}
					<Menu.Items className="absolute right-0 w-40 mt-4 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="px-1 py-1 ">
							<Menu.Item>
								{({ active }) => (
									<button
										type="button"
										className={`${
											active ? "bg-gray-100 text-gray-900" : "text-gray-700"
										} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
										onClick={logout}
									>
										Cerrar sesión
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</header>
	);
}
