import { TabGroup, TabPanel, TabPanels } from "@tremor/react";
import { useEffect } from "react";
import Background from "../common/Background";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import Plans from "../components/Plans";
import { useAuth } from "../hooks/useAuth";

export default function Harmony() {
	const { getProfile } = useAuth();

	useEffect(() => {
		getProfile();
	}, []);

	return (
		<>
			<TabGroup className="h-full font-rhd">
				<Navbar />
				<TabPanels className="h-full pt-12">
					<TabPanel className="h-full mt-0">
						<Dashboard />
					</TabPanel>
					<TabPanel className="h-full mt-0">
						<Plans />
					</TabPanel>
				</TabPanels>
				<Background />
			</TabGroup>
		</>
	);
}
