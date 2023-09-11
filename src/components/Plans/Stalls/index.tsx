import { PlansData } from "../../../hooks/Handlers/usePlans";
import { useAppSelector } from "../../../hooks/store";
import Stall from "./Stall";

export default function Stalls({
	plansData,
}: {
	plansData: PlansData;
}) {
	const { plansStalls } = useAppSelector((state) => state.stalls);

	return (
		<section className="flex flex-col gap-2">
			{plansStalls
				.filter((stall) => stall.customer === plansData.actualCustomer?.id)
				.sort((a, b) => {
					if (a.branch < b.branch) return -1;
					if (a.branch > b.branch) return 1;
					return 0;
				})
				.map((stall) => (
					<Stall key={stall.id} stall={stall} plansData={plansData} />
				))}
		</section>
	);
}
