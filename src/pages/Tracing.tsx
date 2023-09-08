import { useEffect } from "react";
import Background from "../common/Background";
import Navbar from "../components/Navbar";
import Tracing from "../components/Tracing";
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
					<Tracing />
				</main>
				<Background />
			</section>
		</>
	);
}
