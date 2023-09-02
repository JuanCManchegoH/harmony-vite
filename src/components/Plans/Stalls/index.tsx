import { PlansData } from "../../../hooks/Handlers/usePlans";
import { useAppSelector } from "../../../hooks/store";
import Stall from "./Stall";

export default function Stalls({
	plansData,
}: {
	plansData: PlansData;
}) {
	const stalls = useAppSelector((state) => state.stalls.stalls);

	return (
		<section className="flex flex-col gap-2">
			{stalls.map((stall) => (
				<Stall key={stall.id} stall={stall} plansData={plansData} />
			))}
		</section>
	);
}
