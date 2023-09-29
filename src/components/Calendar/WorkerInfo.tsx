import {
	IdentificationIcon,
	ShieldCheckIcon,
	ShieldExclamationIcon,
} from "@heroicons/react/24/solid";
import {
	Badge,
	Card,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
	Text,
} from "@tremor/react";
import EmptyState from "../../common/EmptyState";
import { ShiftWithId } from "../../services/shifts/types";
import { StallWorker } from "../../services/stalls/types";
import { getDiference, minutesToString } from "../../utils/hours";

export default function WorkerInfo({
	worker,
	shifts,
}: { worker: StallWorker; shifts: ShiftWithId[] }) {
	const { wokedHours, absence } = shifts.reduce(
		(acc, shift) => {
			const { minutes } = getDiference(shift.startTime, shift.endTime);

			if (shift.color === "green" || shift.color === "yellow") {
				acc.wokedHours += minutes;
			} else if (shift.color === "red" || shift.color === "sky") {
				acc.absence += minutes;
			}

			return acc;
		},
		{ wokedHours: 0, absence: 0 },
	);

	return (
		<TabGroup defaultIndex={2}>
			<TabList color="rose" className="font-bold">
				<Tab icon={IdentificationIcon}>Información</Tab>
				<Tab icon={ShieldCheckIcon}>Turnos, eventos y descansos</Tab>
			</TabList>
			<TabPanels>
				<TabPanel>
					<section className="grid grid-cols-2 gap-4 mt-4">
						<div className="rounded-md px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-600 text-left">
							<label className="block text-xs font-medium text-gray-900">
								Nombre
							</label>
							<p className="text-sm font-medium text-gray-900 text-left rounded-md truncate">
								{worker.name}
							</p>
						</div>
						<div className="rounded-md px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-600 text-left">
							<label className="block text-xs font-medium text-gray-900">
								Identificación
							</label>
							<p className="text-sm font-medium text-gray-900 text-left rounded-md truncate">
								{worker.identification}
							</p>
						</div>
						<div className="rounded-md px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-600 text-left">
							<label className="block text-xs font-medium text-gray-900">
								Cargo
							</label>
							<p className="text-sm font-medium text-gray-900 text-left rounded-md truncate">
								{worker.position}
							</p>
						</div>
						<div className="rounded-md px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-600 text-left">
							<label className="block text-xs font-medium text-gray-900">
								Codigo Harmony
							</label>
							<p className="text-sm font-medium text-gray-900 text-left rounded-md truncate">
								{worker.id}
							</p>
						</div>
						<div className="rounded-md px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-600 text-left">
							<label className="block text-xs font-medium text-gray-900">
								Horas trabajadas en todos los puestos
							</label>
							<p className="text-sm font-medium text-gray-900 text-left rounded-md truncate">
								{minutesToString(wokedHours - absence)}
							</p>
						</div>
						<div className="rounded-md px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-600 text-left">
							<label className="block text-xs font-medium text-gray-900">
								Agregado por
							</label>
							<p className="text-sm font-medium text-gray-900 text-left rounded-md truncate">
								{worker.createdBy}
							</p>
						</div>
					</section>
				</TabPanel>
				<TabPanel>
					<section className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto p-1">
						{shifts.length === 0 && (
							<div className="col-span-2">
								<EmptyState>
									<ShieldExclamationIcon className="w-10 h-10 text-sky-500" />
									<Text className="text-gray-600">
										No hay turnos, descansos o eventos que mostrar.
									</Text>
								</EmptyState>
							</div>
						)}
						{shifts
							.sort((a, b) => {
								if (a.day > b.day) return 1;
								if (a.day < b.day) return -1;
								return 0;
							})
							.map((shift) => {
								const { minutes } = getDiference(
									shift.startTime,
									shift.endTime,
								);
								return (
									<Card
										key={shift.id}
										className="flex flex-col items-center gap-1 p-2"
									>
										<Badge
											tooltip={shift.workerName}
											color={shift.color}
											className="font-bold"
										>
											{shift.day.substring(0, 5)} | {minutesToString(minutes)}
											H
										</Badge>
										<span className="truncate font-bold text-xs">
											{shift.abbreviation} | {shift.startTime} - {shift.endTime}
										</span>
									</Card>
								);
							})}
					</section>
				</TabPanel>
			</TabPanels>
		</TabGroup>
	);
}
