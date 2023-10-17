import { Transition } from "@headlessui/react";
import {
	DocumentTextIcon,
	QueueListIcon,
	RectangleGroupIcon,
	RectangleStackIcon,
	TagIcon,
} from "@heroicons/react/24/solid";
import {
	Card,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
} from "@tremor/react";
import { Fragment, useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/store";
import { useUsers } from "../../hooks/useUsers";
import classNames from "../../utils/classNames";
import Conventions from "./Conventions";
import Fields from "./Fields";
import Positions from "./Positions";
import Sequences from "./Sequences";
import Tags from "./Tags";
import Users from "./Users";

const navItems = [
	{
		name: "Campos",
		icon: DocumentTextIcon,
		component: Fields,
	},
	{
		name: "Cargos",
		icon: RectangleGroupIcon,
		component: Positions,
	},
	{
		name: "Convenciones",
		icon: QueueListIcon,
		component: Conventions,
	},
	{
		name: "Secuencias",
		icon: RectangleStackIcon,
		component: Sequences,
	},
	{
		name: "Etiquetas",
		icon: TagIcon,
		component: Tags,
	},
];

export default function Dashboard({ display }: { display: boolean }) {
	const { users } = useAppSelector((state) => state.users);
	const { profile } = useAppSelector((state) => state.auth);
	const { getUsers } = useUsers(profile, users);
	const [currentTab, setCurrentTab] = useState<number>(0);

	useEffect(() => {
		profile.company.id && getUsers();
	}, [profile]);

	return (
		<>
			<Card
				decoration="bottom"
				decorationColor="rose"
				className={classNames(
					"col-span-2 p-0 bg-gray-50 overflow-auto h-full",
					display ? "" : "hidden",
				)}
			>
				<Users />
			</Card>
			<Card
				decoration="bottom"
				decorationColor="rose"
				className={classNames(
					"col-span-1 overflow-auto p-0 bg-gray-50",
					display ? "" : "hidden",
				)}
			>
				<TabGroup
					className="flex flex-col items-center"
					onIndexChange={(index) => setCurrentTab(index)}
				>
					<TabList
						color="rose"
						variant="solid"
						className="sticky top-0 p-2 bg-gray-50 w-full flex justify-center"
					>
						{navItems.map((item, i) => (
							<Tab
								key={item.name}
								icon={item.icon}
								title={item.name}
								className="font-bold text-gray-600 hover:text-gray-800"
							>
								<Transition
									as={Fragment}
									show={currentTab === i}
									enter="transform transition ease-in-out duration-400"
									enterFrom="translate-x-full"
									enterTo="translate-x-0"
								>
									<p>{item.name}</p>
								</Transition>
							</Tab>
						))}
					</TabList>
					<TabPanels className="px-4">
						{navItems.map((item) => (
							<TabPanel key={item.name}>
								<item.component />
							</TabPanel>
						))}
					</TabPanels>
				</TabGroup>
			</Card>
		</>
	);
}
