import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import {
	Badge,
	Card,
	CategoryBar,
	Flex,
	ProgressBar,
	Text,
} from "@tremor/react";
import { useAppSelector } from "../../hooks/store";
import { CustomerWithId } from "../../services/customers/types";
import { ShiftWithId, eventTypes } from "../../services/shifts/types";
import { getDiference } from "../../utils/hours";

export default function Customer({
	customer,
	selectedMonth,
	selectedYear,
}: { customer: CustomerWithId; selectedMonth: string; selectedYear: string }) {
	const { shifts, stalls } = useAppSelector((state) => state.statistics);
	const customerStalls = stalls.filter(
		(stall) => stall.customer === customer.id,
	);

	const { events, tracingShifts, customerEvents } = shifts.reduce(
		(accumulator, shift) => {
			const isEventTypeIncluded = eventTypes.includes(shift.type);
			const isStallInCustomerStalls = customerStalls.some(
				(stall) => stall.id === shift.stall,
			);

			if (isEventTypeIncluded && isStallInCustomerStalls) {
				accumulator.events.push(shift);
			}

			if (!isEventTypeIncluded && isStallInCustomerStalls) {
				accumulator.tracingShifts.push(shift);
			}

			if (shift.stall === customer.id) {
				accumulator.customerEvents.push(shift);
			}

			return accumulator;
		},
		{
			events: [] as ShiftWithId[],
			tracingShifts: [] as ShiftWithId[],
			customerEvents: [] as ShiftWithId[],
		},
	);

	const percentage = (data: ShiftWithId[]) => {
		const total = tracingShifts.length + events.length + customerEvents.length;
		if (data.length === 0 || total === 0) return 0;
		return (data.length / total) * 100;
	};

	const customerShifts = [...tracingShifts, ...events, ...customerEvents];
	const totalHours = customerShifts
		.filter((shift) => shift.color === "green" || shift.color === "yellow")
		.reduce(
			(acc, shift) => acc + getDiference(shift.startTime, shift.endTime).hours,
			0,
		);
	const absenceHours = customerShifts
		.filter((shift) => shift.color === "red" || shift.color === "sky")
		.reduce(
			(acc, shift) => acc + getDiference(shift.startTime, shift.endTime).hours,
			0,
		);
	const absenceRate = totalHours === 0 ? 0 : (absenceHours / totalHours) * 100;

	const actualMonthAndYear =
		`${selectedMonth}-${selectedYear}` ===
		`${new Date().getMonth()}-${new Date().getFullYear()}`;
	const branches = customerStalls.reduce((acc, stall) => {
		if (!acc.includes(stall.branch)) {
			acc.push(stall.branch);
		}
		return acc;
	}, [] as string[]);

	return (
		<Card className="flex flex-col gap-2 p-2 bg-gray-50">
			<header className="grid grid-cols-3">
				<h2 className="flex font-bold items-center col-span-2">
					<div>
						<CalendarDaysIcon className="w-5 h-5 mr-2" />
					</div>
					<p title={customer.name} className="truncate text-sm">
						{customer.name}
					</p>
				</h2>
				<div className="flex justify-end">
					<Badge className="font-bold" color="sky">
						{actualMonthAndYear ? "En curso" : "Finalizado"}
					</Badge>
				</div>
			</header>
			<CategoryBar
				values={[40, 30, 20, 10]}
				colors={["rose", "orange", "yellow", "emerald"]}
				markerValue={100 - absenceRate}
				tooltip={`${(100 - absenceRate).toFixed(0)}% de asistencia`}
			/>
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
							{tracingShifts.filter((shift) => shift.color === "green").length}
						</Text>
					</Flex>
					<ProgressBar
						value={percentage(
							tracingShifts.filter((shift) => shift.color === "green"),
						)}
						color="green"
						className="mt-1"
					/>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Text>Descansos</Text>
						<Text>
							{tracingShifts.filter((shift) => shift.color === "gray").length}
						</Text>
					</Flex>
					<ProgressBar
						value={percentage(
							tracingShifts.filter((shift) => shift.color === "gray"),
						)}
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
