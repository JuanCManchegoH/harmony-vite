import { TabGroup, TabPanel, TabPanels } from "@tremor/react";
import { useEffect, useState } from "react";
import Background from "../common/Background";
import Calendar from "../components/Calendar";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import Statistics from "../components/Statistics";
import { useAuth } from "../hooks/useAuth";

export default function Harmony() {
	const [tabIndex, setTabIndex] = useState(0);
	const { getProfile } = useAuth();

	useEffect(() => {
		getProfile();
	}, []);

	return (
		<TabGroup
			onIndexChange={(i) => setTabIndex(i)}
			className="h-full font-rhd grid"
		>
			<Navbar />
			<TabPanels className="grid">
				<TabPanel className="mt-0 pt-12">
					<Dashboard />
				</TabPanel>
				<TabPanel className="mt-0 pt-12">
					<Calendar />
				</TabPanel>
				<TabPanel className="mt-0 pt-12">
					<Statistics tabIndex={tabIndex} />
				</TabPanel>
			</TabPanels>
			<Background />
		</TabGroup>
	);
}
