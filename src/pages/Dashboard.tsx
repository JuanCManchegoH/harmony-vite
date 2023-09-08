import { useEffect } from "react";
import Background from "../common/Background";
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
			<section className="h-full font-rhd">
				<Navbar />
				<main className="h-full pt-12">
					<Dashboard />
				</main>
				<Background />
			</section>
		</>
	);
}
