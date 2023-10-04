import { SignalIcon } from "@heroicons/react/24/solid";
import { Card, Flex, Icon, ProgressBar, Subtitle, Title } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "../../hooks/store";
import { CustomerWithId } from "../../services/customers/types";
import { ShiftWithId, eventTypes } from "../../services/shifts/types";
import classNames from "../../utils/classNames";
import { getDiference } from "../../utils/hours";

export default function Customer({
	customer,
	selectedMonth,
	selectedYear,
	selectedCCustomers,
	setSelectedCCustomers,
}: {
	customer: CustomerWithId;
	selectedMonth: string;
	selectedYear: string;
	selectedCCustomers: string[];
	setSelectedCCustomers: Dispatch<SetStateAction<string[]>>;
}) {
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
			if (shift.stall === customer.id && shift.color !== "gray") {
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
	const attendanceRate = 100 - absenceRate;

	const actualMonthAndYear =
		`${selectedMonth}-${selectedYear}` ===
		`${new Date().getMonth()}-${new Date().getFullYear()}`;
	const branches = customerStalls.reduce((acc, stall) => {
		if (!acc.includes(stall.branch)) {
			acc.push(stall.branch);
		}
		return acc;
	}, [] as string[]);

	const handleSelectCustomers = () => {
		if (selectedCCustomers.includes(customer.id)) {
			setSelectedCCustomers(
				selectedCCustomers.filter((id) => id !== customer.id),
			);
		} else {
			setSelectedCCustomers([...selectedCCustomers, customer.id]);
		}
	};

	return (
		<Card className="flex flex-col gap-1 p-2 bg-gray-50">
			<header className="grid grid-cols-5">
				<div className="col-span-4 flex gap-2 items-center">
					<input
						type="checkbox"
						checked={selectedCCustomers.includes(customer.id)}
						onChange={() => handleSelectCustomers()}
						className="h-4 w-4 rounded-full border-gray-300 text-sky-600 cursor-pointer"
					/>
					<Title title={customer.name} className="truncate text-sm uppercase">
						{customer.name}
					</Title>
				</div>
				<div className="flex justify-end">
					<Icon
						icon={SignalIcon}
						variant="solid"
						color={actualMonthAndYear ? "emerald" : "gray"}
						className={classNames(actualMonthAndYear ? "animate-pulse" : "")}
					/>
				</div>
			</header>
			<section className="-mt-1 leading-4">
				<Subtitle>Asistencia</Subtitle>
				<ProgressBar
					value={attendanceRate}
					color={
						absenceRate < 10 ? "emerald" : absenceRate < 20 ? "amber" : "rose"
					}
					tooltip={`Asistencia: ${attendanceRate.toFixed(0)}%`}
				/>
			</section>
			<main className="grid grid-cols-2 gap-2">
				<div className="border p-2 rounded-md">
					<Flex>
						<Title>Sedes</Title>
						<Subtitle>{branches.length}</Subtitle>
					</Flex>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Title>Puestos</Title>
						<Subtitle>{customerStalls.length}</Subtitle>
					</Flex>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Title>Turnos</Title>
						<Subtitle>
							{tracingShifts.filter((shift) => shift.color === "green").length}
						</Subtitle>
					</Flex>
					<ProgressBar
						value={percentage(
							tracingShifts.filter((shift) => shift.color === "green"),
						)}
						color="sky"
						className="mt-1"
					/>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Title>Descansos</Title>
						<Subtitle>
							{tracingShifts.filter((shift) => shift.color === "gray").length}
						</Subtitle>
					</Flex>
					<ProgressBar
						value={percentage(
							tracingShifts.filter((shift) => shift.color === "gray"),
						)}
						color="sky"
						className="mt-1"
					/>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Title>Eventos</Title>
						<Subtitle>{events.length}</Subtitle>
					</Flex>
					<ProgressBar
						color="sky"
						value={percentage(events)}
						className="mt-1"
					/>
				</div>
				<div className="border p-2 rounded-md">
					<Flex>
						<Title>Ocasionales</Title>
						<Subtitle>{customerEvents.length}</Subtitle>
					</Flex>
					<ProgressBar
						color="sky"
						value={percentage(customerEvents)}
						className="mt-1"
					/>
				</div>
			</main>
		</Card>
	);
}
