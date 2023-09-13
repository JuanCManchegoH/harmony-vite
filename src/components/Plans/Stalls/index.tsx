import { filterByBranch } from "..";
import { PlansData } from "../../../hooks/Handlers/usePlans";
import { useAppSelector } from "../../../hooks/store";
import Stall from "./Stall";

export default function Stalls({
	plansData,
	activeBranches,
}: {
	plansData: PlansData;
	activeBranches: string[];
}) {
	const { stalls } = useAppSelector((state) => state.stalls);

	return (
		<section className="flex flex-col gap-2">
			{stalls
				.filter((stall) => stall.customer === plansData.actualCustomer?.id)
				.filter((stall) => filterByBranch(stall, activeBranches))
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
