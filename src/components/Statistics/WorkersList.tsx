import {
	ArrowDownCircleIcon,
	IdentificationIcon,
	MagnifyingGlassCircleIcon,
	RectangleGroupIcon,
	ShieldCheckIcon,
	ShieldExclamationIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	AccordionList,
	Badge,
	Button,
	Icon,
	MultiSelect,
	MultiSelectItem,
	NumberInput,
	Text,
} from "@tremor/react";
import { Dispatch, SetStateAction, useState } from "react";
import { useAppSelector } from "../../hooks/store";
import { ShiftWithId } from "../../services/shifts/types";
import { getDiference } from "../../utils/hours";
import { groupedShiftsExtended } from "../../utils/statistics";
import Group from "./Group";

export const hours = (shifts: ShiftWithId[]) =>
	shifts.reduce(
		(acc, shift) => acc + getDiference(shift.startTime, shift.endTime).hours,
		0,
	);
export interface WorkerListFilters {
	abbsList: string[];
	selectedAbbreviations: string[];
	setSelectedAbbreviations: Dispatch<SetStateAction<string[]>>;
	positionsList: string[];
	selectedPositions: string[];
	setSelectedPositions: Dispatch<SetStateAction<string[]>>;
	selectedCustomers: string[];
	setSelectedCustomers: Dispatch<SetStateAction<string[]>>;
	minHours: number;
	setMinHours: Dispatch<SetStateAction<number>>;
}

export default function WorkersList({
	page,
	setPage,
	filters,
	generateExcel,
	year,
}: {
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	filters: WorkerListFilters;
	generateExcel: () => void;
	year: string;
}) {
	const [selectedMinHour, setSelectedMinHour] = useState(0);
	const { groupsToShow, groupedShiftsLength } = useAppSelector(
		(state) => state.statistics,
	);
	const { customers } = useAppSelector((state) => state.customers);

	const totalPages = Math.ceil(groupedShiftsLength / 100);
	const filtersArray = [
		{
			name: "Abreviatura",
			items: filters.abbsList,
			value: filters.selectedAbbreviations,
			setValue: filters.setSelectedAbbreviations,
			title: "Nombre",
			icon: ShieldExclamationIcon,
		},
		{
			name: "Cargo",
			items: filters.positionsList,
			value: filters.selectedPositions,
			setValue: filters.setSelectedPositions,
			title: "Cargo",
			icon: RectangleGroupIcon,
		},
		{
			name: "Cliente",
			items: customers.map((customer) => customer.name),
			value: filters.selectedCustomers,
			setValue: filters.setSelectedCustomers,
			title: "Cliente",
			icon: UserGroupIcon,
		},
	];

	return (
		<div className="p-0 bg-gray-50">
			<header className="grid grid-cols-3 p-2">
				<div className="flex items-center gap-2">
					<Icon
						size="sm"
						variant="solid"
						icon={ArrowDownCircleIcon}
						onClick={generateExcel}
						className="cursor-pointer"
						tooltip="Descargar Listado"
					/>

					<Badge
						size="lg"
						color="sky"
						className="font-bold"
						icon={IdentificationIcon}
					>
						{groupedShiftsLength} PERSONAS
					</Badge>
				</div>
				<div className="grid grid-cols-3 gap-2 items-center">
					{filtersArray.map(({ name, icon, value, setValue, items }, i) => (
						<MultiSelect
							key={name}
							icon={icon}
							placeholder={name}
							value={value}
							onValueChange={(value) => setValue(value)}
						>
							{items.map((value) => (
								<MultiSelectItem key={`${name}-${i}`} value={value}>
									{value}
								</MultiSelectItem>
							))}
						</MultiSelect>
					))}
					<div className="flex items-center gap-2">
						<NumberInput
							min={0}
							enableStepper={false}
							defaultValue={selectedMinHour}
							onValueChange={(v) => setSelectedMinHour(v)}
							placeholder="Minimo de horas"
						/>
						<MagnifyingGlassCircleIcon
							className="w-8 h-8 text-gray-500 hover:text-sky-500 cursor-pointer"
							onClick={() => filters.setMinHours(selectedMinHour)}
						/>
					</div>
				</div>
				{totalPages > 1 && (
					<div className="flex gap-2 items-center justify-end p-2">
						<Button
							size="sm"
							color="sky"
							variant="secondary"
							onClick={() => setPage(page - 1)}
							disabled={page === 1}
						>
							Anterior
						</Button>
						<Text className="text-lg font-medium">
							{page} / {totalPages}
						</Text>
						<Button
							size="sm"
							color="sky"
							variant="secondary"
							onClick={() => setPage(page + 1)}
							disabled={page === totalPages}
						>
							Siguiente
						</Button>
					</div>
				)}
			</header>
			<AccordionList className="bg-gray-50 flex flex-col">
				{groupsToShow.map((shifts, index) => {
					const green = shifts.filter((s) => s.color === "green");
					const gray = shifts.filter((s) => s.color === "gray");
					const yellow = shifts.filter((s) => s.color === "yellow");
					const red = shifts.filter((s) => s.color === "red");
					const sky = shifts.filter((s) => s.color === "sky");

					return (
						<>
							<Accordion
								key={`shifts-${index}-${shifts[0].id}`}
								className="font-medium uppercase"
							>
								<AccordionHeader>
									<div className="flex gap-4 items-center">
										<div className="flex w-8 h-8 rounded-lg bg-sky-400 text-white items-center justify-center">
											{index + 1 + (page - 1) * 100}
										</div>
										<p>{shifts[0].workerName}</p>
										{green.length ? (
											<Badge color="green" icon={ShieldCheckIcon}>
												{green.length} Turnos | {hours(green)}H
											</Badge>
										) : null}
										{gray.length ? (
											<Badge color="gray" icon={ShieldCheckIcon}>
												{gray.length} Descansos
											</Badge>
										) : null}
										{yellow.length ? (
											<Badge color="yellow" icon={ShieldExclamationIcon}>
												{yellow.length} Adicionales
											</Badge>
										) : null}
										{red.length ? (
											<Badge color="red" icon={ShieldExclamationIcon}>
												{red.length} Ausencias
											</Badge>
										) : null}
										{sky.length ? (
											<Badge color="sky" icon={ShieldExclamationIcon}>
												{sky.length} Seguimiento
											</Badge>
										) : null}
									</div>
								</AccordionHeader>
								<AccordionBody>
									{groupedShiftsExtended(shifts).map((g) => {
										return <Group shifts={g} year={year} />;
									})}
								</AccordionBody>
							</Accordion>
						</>
					);
				})}
			</AccordionList>
		</div>
	);
}
