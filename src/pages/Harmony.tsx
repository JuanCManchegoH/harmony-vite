import { TabGroup } from "@tremor/react";
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
			className="font-rhd h-screen"
		>
			<section className="h-full grid grid-cols-3 gap-2 pt-16 p-2">
				<Navbar />
				<Dashboard display={tabIndex === 0} />
				<Calendar display={tabIndex === 1} />
				<Statistics tabIndex={tabIndex} display={tabIndex === 2} />
			</section>
			<Background />
		</TabGroup>
	);
}
