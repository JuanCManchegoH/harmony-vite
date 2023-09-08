import { Badge, Card, Flex, ProgressBar, Text } from "@tremor/react";
import { useAppSelector } from "../../hooks/store";
import { TracingData } from "../../hooks/useTracing";
import { CustomerWithId } from "../../services/customers/types";
import { ShiftWithId } from "../../services/shifts/types";
import { eventTypes } from "../Plans";

export default function Customer({
	customer,
	tracingData,
}: { customer: CustomerWithId; tracingData: TracingData }) {
	const { tracingStalls } = useAppSelector((state) => state.stalls);
	const { tracingShifts } = useAppSelector((state) => state.shifts);
	const customerStalls = tracingStalls.filter(
		(stall) => stall.customer === customer.id,
	);
	const shifts = tracingShifts.filter(
		(shift) =>
			!eventTypes.includes(shift.type) &&
			customerStalls.some((stall) => stall.id === shift.stall),
	);
	const events = tracingShifts.filter(
		(shift) =>
			eventTypes.includes(shift.type) &&
			customerStalls.some((stall) => stall.id === shift.stall),
	);
	const customerEvents = tracingShifts.filter(
		(shift) => shift.stall === customer.id,
	);

	const percentage = (data: ShiftWithId[]) => {
		const total = shifts.length + events.length + customerEvents.length;
		return (data.length / total) * 100;
	};

	const actualMonthAndYear =
		`${tracingData.selectedMonth}-${tracingData.selectedYear}` ===
		`${new Date().getMonth()}-${new Date().getFullYear()}`;
	const branches = customerStalls.reduce((acc, stall) => {
		if (!acc.includes(stall.branch)) {
			acc.push(stall.branch);
		}
		return acc;
	}, [] as string[]);

	return (
		<Card className="flex flex-col gap-2 p-2 bg-gray-50">
			<header className="flex justify-between items-center border-b pb-2">
				<h2 className="font-bold">{customer.name}</h2>
				<Badge className="font-bold" color="sky">
					{actualMonthAndYear ? "En curso" : "Finalizado"}
				</Badge>
			</header>
			<main className="grid grid-cols-2 gap-2">
				<div className="border p-2 rounded-md">
					<Flex>
						<Text>Sedes</Text>
						<Text>{branches.length}</Text>
					</Flex>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Text>Puestos</Text>
						<Text>{customerStalls.length}</Text>
					</Flex>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Text>Turnos</Text>
						<Text>
							{shifts.filter((shift) => shift.color === "green").length}
						</Text>
					</Flex>
					<ProgressBar
						value={percentage(
							shifts.filter((shift) => shift.color === "green"),
						)}
						color="green"
						className="mt-1"
					/>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Text>Descansos</Text>
						<Text>
							{shifts.filter((shift) => shift.color === "gray").length}
						</Text>
					</Flex>
					<ProgressBar
						value={percentage(shifts.filter((shift) => shift.color === "gray"))}
						color="gray"
						className="mt-1"
					/>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Text>Eventos</Text>
						<Text>{events.length}</Text>
					</Flex>
					<ProgressBar
						value={percentage(events)}
						color="amber"
						className="mt-1"
					/>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Text>Ocasionales</Text>
						<Text>{customerEvents.length}</Text>
					</Flex>
					<ProgressBar
						value={percentage(customerEvents)}
						color="blue"
						className="mt-1"
					/>
				</div>
			</main>
		</Card>
	);
}
