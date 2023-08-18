import { TabGroup, TabPanel, TabPanels } from "@tremor/react";
import { useEffect } from "react";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
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
				</TabPanels>
			</TabGroup>
		</>
	);
}
