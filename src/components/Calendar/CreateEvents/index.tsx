import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { CreateEvent } from "../../../hooks/useCalendar";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";

export default function CreateEvents({
	createEvent,
	selectedTab,
	setSelectedTab,
}: {
	createEvent: CreateEvent;
	selectedTab: number;
	setSelectedTab: Dispatch<SetStateAction<number>>;
}) {
	return (
		<TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
			<TabList color="rose" variant="solid" className="col-span-2">
				<Tab className="text-base font-bold hover:text-gray-800 dark:hover:text-gray-800 text-gray-700 dark:text-gray-700 items-center">
					Paso 1
				</Tab>
				<Tab className="text-base font-bold hover:text-gray-800 dark:hover:text-gray-800 text-gray-700 dark:text-gray-700 items-center">
					Paso 2
				</Tab>
			</TabList>
			<TabPanels>
				<TabPanel>
					<FirstStep createEvent={createEvent} />
				</TabPanel>
				<TabPanel>
					<SecondStep createEvent={createEvent} />
				</TabPanel>
			</TabPanels>
		</TabGroup>
	);
}
