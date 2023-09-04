import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { CreateEvent } from "../../../hooks/Handlers/usePlans";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";

export default function CreateEvents({
	createEvent,
}: {
	createEvent: CreateEvent;
}) {
	return (
		<TabGroup>
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
