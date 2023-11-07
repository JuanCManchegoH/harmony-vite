import { Badge, Text } from "@tremor/react";
import { useAppSelector } from "../../hooks/store";
import { ShiftWithId } from "../../services/shifts/types";
import { groupDates } from "../../utils/dates";
import formatCurrency from "../../utils/formatCurrency";
import { hours } from "./WorkersList";

export default function Group({
	shifts,
	year,
}: { shifts: ShiftWithId[]; year: string }) {
	const { stalls } = useAppSelector((state) => state.statistics);
	const { customers } = useAppSelector((state) => state.customers);
	const { positions } = useAppSelector((state) => state.auth.profile.company);
	const stall = stalls.find((stall) => stall.id === shifts[0].stall);
	const customer = customers.find(
		(customer) => customer.id === shifts[0].stall,
	);
	const position =
		shifts[0].position ||
		stall?.workers.find((worker) => worker.id === shifts[0].worker)?.position;

	const positionValue =
		position &&
		positions.find((p) => p.name === position && String(p.year) === year)
			?.value;

	return (
		<section className="grid grid-cols-5 bg-gray-50 my-2 p-2 rounded-lg">
			<Badge color={shifts[0].color} className="mb-2 font-bold">
				Tipo: {shifts[0].abbreviation} | Cantidad: {shifts.length} | Horas:{" "}
				{hours(shifts)}
			</Badge>
			<div
				title={stall?.customerName || customer?.name}
				className="truncate px-2"
			>
				<Text className="truncate">
					<span className="font-bold">Cliente: </span>
					{stall?.customerName || customer?.name}
				</Text>
				<Text className="truncate">{shifts[0].sequence}</Text>
			</div>
			<div
				className="px-2"
				title={shifts[0].stallName !== stall?.name ? "-" : shifts[0].stallName}
			>
				<Text className="truncate">
					<span className="font-bold">Puesto: </span>
					{shifts[0].stallName !== stall?.name ? "-" : shifts[0].stallName}
				</Text>
				<Text className="truncate">{stall?.branch}</Text>
			</div>
			<div>
				<Text>
					{positionValue && shifts[0].color === "yellow"
						? `${formatCurrency(positionValue * hours(shifts))}`
						: ""}
				</Text>
			</div>
			<div className="flex flex-col items-end gap-1 font-bold">
				{groupDates(shifts.map((shift) => shift.day)).join(" | ")}
			</div>
			<div className="col-span-4">
				<h2 className="text-zinc-900 font-bold">Descripcion:</h2>
				<p>{shifts[0].description}</p>
			</div>
			<div className="flex justify-end">{position}</div>
		</section>
	);
}
