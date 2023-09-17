import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import {
	CalendarIcon,
	ChartPieIcon,
	HomeIcon,
} from "@heroicons/react/24/solid";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button, Icon } from "@tremor/react";
import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Avatar from "../common/Avatar";
import { useAppSelector } from "../hooks/store";
import { useAuth } from "../hooks/useAuth";
import Logs from "./Logs";

export const navigation = [
	{ name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
	{ name: "Calendario", icon: CalendarIcon, href: "/calendario" },
	{
		name: "Estadísticas",
		icon: ChartPieIcon,
		href: "/estadisticas",
	},
];

export default function Navbar() {
	const profile = useAppSelector((state) => state.auth.profile);
	const { logout } = useAuth();
	const location = useLocation().pathname;
	const current = navigation.findIndex((item) => item.href === location);
	const [openLogs, setOpenLogs] = useState(false);

	return (
		<header className="fixed bg-gray-50 inset-x-0 px-2 top-0 z-20 flex justify-end items-center h-14 font-rhd border-b">
			<div className="flex absolute left-2 items-center gap-1">
				<Menu as="div" className="relative inline-block text-left">
					<Menu.Button
						className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500"
						title={profile.userName}
					>
						<Avatar title={profile.userName} letter={profile.userName[0]} />
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
						<Menu.Items className="absolute left-0 w-40 mt-4 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
				<Icon
					icon={BellIcon}
					color="gray"
					variant="simple"
					className="cursor-pointer"
					onClick={() => setOpenLogs(true)}
				/>
			</div>
			<img src="harmony-logo.png" alt="Harmony" className="h-9 w-auto" />
			<Player
				src="https://lottie.host/b83ec7da-2180-410c-abfd-da574078a863/1KdE2tEL0F.json"
				className="player"
				autoplay
				loop
				style={{
					height: "77px",
					width: "77px",
					right: "90px",
					top: "-11px",
					position: "absolute",
				}}
			/>
			<nav className="flex gap-2 absolute left-1/2 transform -translate-x-1/2">
				{navigation.map((item) => (
					<Link to={item.href} key={item.name}>
						<Button
							variant={
								current === navigation.indexOf(item) ? undefined : "secondary"
							}
							size="sm"
							color={current === navigation.indexOf(item) ? "rose" : "gray"}
							icon={item.icon}
						>
							{item.name}
						</Button>
					</Link>
				))}
			</nav>
			<Logs open={openLogs} setOpen={setOpenLogs} />
		</header>
	);
}
