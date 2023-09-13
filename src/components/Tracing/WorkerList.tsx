import { InformationCircleIcon } from "@heroicons/react/24/solid";
import {
	Card,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Text,
} from "@tremor/react";
import { useAppSelector } from "../../hooks/store";
import { ShiftWithId } from "../../services/shifts/types";
import { groupDates } from "../../utils/dates";
import { getDiference } from "../../utils/hours";

export default function WorkerList({
	groupedShifts,
}: { groupedShifts: ShiftWithId[][] }) {
	const { stalls } = useAppSelector((state) => state.stalls);
	const { customers } = useAppSelector((state) => state.customers);
	return (
		<Card className="p-0">
			<Table>
				<TableHead>
					<TableRow>
						<TableHeaderCell>#</TableHeaderCell>
						<TableHeaderCell>Nombre</TableHeaderCell>
						<TableHeaderCell>Fechas</TableHeaderCell>
						<TableHeaderCell>Tipo</TableHeaderCell>
						<TableHeaderCell>Horas</TableHeaderCell>
						<TableHeaderCell>Cliente</TableHeaderCell>
						<TableHeaderCell>Puesto</TableHeaderCell>
						<TableHeaderCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{groupedShifts.map((shifts, index) => {
						const stall = stalls.find((stall) => stall.id === shifts[0].stall);
						const customer = customers.find(
							(customer) => customer.id === shifts[0].stall,
						);
						const position =
							shifts[0].position ||
							stall?.workers.find((worker) => worker.id === shifts[0].worker)
								?.position;
						return (
							<>
								<TableRow key={`shifts-${index}`} className="font-medium">
									<TableCell>{index + 1}</TableCell>
									<TableCell title="Nombre">
										<Text>{shifts[0].workerName}</Text>
										{position || "-"}
									</TableCell>
									<TableCell className="flex text-xs" title="Fechas">
										{groupDates(shifts.map((shift) => shift.day)).join(" | ")}
									</TableCell>
									<TableCell title="Tipo">
										<Text color={shifts[0].color}>
											{shifts[0].abbreviation}
										</Text>
									</TableCell>
									<TableCell title="Horas">
										{shifts.reduce(
											(acc, shift) =>
												acc +
												getDiference(shift.startTime, shift.endTime).hours,
											0,
										) || "-"}
									</TableCell>
									<TableCell title="Cliente" className="max-w-[200px] truncate">
										<Text className="truncate">
											{stall?.customerName || customer?.name}
										</Text>
										<Text className="truncate">{shifts[0].sequence}</Text>
									</TableCell>
									<TableCell className="max-w-[200px]" title="Puesto">
										<Text className="truncate">
											{shifts[0].stallName !== stall?.name
												? "-"
												: shifts[0].stallName}
										</Text>
										<Text className="truncate">{stall?.branch}</Text>
									</TableCell>
									<TableCell
										title={shifts[0].description}
										className="flex justify-end "
									>
										{shifts[0].description && (
											<InformationCircleIcon className="w-5 h-5" />
										)}
									</TableCell>
								</TableRow>
							</>
						);
					})}
				</TableBody>
			</Table>
		</Card>
	);
}
