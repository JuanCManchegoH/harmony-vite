import { IdentificationIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Card, Tab, TabGroup, TabList, TabPanels } from "@tremor/react";
import FieldsSection from "./FieldsSection";

export default function Fields() {
	return (
		<Card className="px-4 py-0 overflow-auto">
			<TabGroup className="flex flex-col items-center sticky top-0 bg-white pt-4">
				<TabList color="rose" variant="solid">
					<Tab
						className="text-base font-bold hover:text-gray-800 dark:hover:text-gray-800 text-gray-700 dark:text-gray-700 items-center"
						icon={UserGroupIcon}
					>
						Clientes
					</Tab>
					<Tab
						className="text-base font-bold hover:text-gray-800 dark:hover:text-gray-800 text-gray-700 dark:text-gray-700 items-center"
						icon={IdentificationIcon}
					>
						Personal
					</Tab>
				</TabList>

				<TabPanels className="px-1">
					<FieldsSection type="customers" />
					<FieldsSection type="workers" />
				</TabPanels>
			</TabGroup>
		</Card>
	);
}
