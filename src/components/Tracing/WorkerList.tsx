import {
	ArrowDownCircleIcon,
	IdentificationIcon,
	InformationCircleIcon,
	RectangleGroupIcon,
	ShieldExclamationIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
	Button,
	Card,
	Icon,
	MultiSelect,
	MultiSelectItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Text,
} from "@tremor/react";
import { useState } from "react";
import { useAppSelector } from "../../hooks/store";
import { useExcel } from "../../hooks/useTracing";
import { ShiftWithId } from "../../services/shifts/types";
import { groupDates } from "../../utils/dates";
import { getDiference } from "../../utils/hours";

interface Filter {
	names: string[];
	positions: string[];
	types: string[];
	customers: string[];
}

export default function WorkerList({
	groupedShifts,
}: { groupedShifts: ShiftWithId[][] }) {
	const { stalls } = useAppSelector((state) => state.stalls);
	const { customers } = useAppSelector((state) => state.customers);
	const { workers } = useAppSelector((state) => state.workers);

	function getUniqueValues(arr: ShiftWithId[], property: string) {
		const uniqueValues = new Set();
		arr.forEach((item) => {
			uniqueValues.add(item[property as keyof ShiftWithId]);
		});
		return Array.from(uniqueValues) as string[];
	}

	const names = getUniqueValues(
		groupedShifts.map((shifts) => shifts[0]),
		"workerName",
	).map((name) => name.toUpperCase());
	const positions = groupedShifts
		.reduce((acc, shifts) => {
			const stall = stalls.find((stall) => stall.id === shifts[0].stall);
			const worker = stall?.workers.find(
				(worker) => worker.id === shifts[0].worker,
			);
			if (worker && !acc.includes(worker.position)) {
				acc.push(worker.position);
			}
			return acc;
		}, [] as string[])
		.map((position) => position.toUpperCase());

	const types = getUniqueValues(
		groupedShifts.map((shifts) => shifts[0]),
		"abbreviation",
	).map((type) => type.toUpperCase());

	const customersNames = groupedShifts
		.reduce((acc, shifts) => {
			const stall = stalls.find((stall) => stall.id === shifts[0].stall);
			const customer = customers.find(
				(customer) => customer.id === shifts[0].stall,
			);
			if (stall && !acc.includes(stall.customerName)) {
				acc.push(stall.customerName);
			}
			if (customer && !acc.includes(customer.name)) {
				acc.push(customer.name);
			}
			return acc;
		}, [] as string[])
		.map((customer) => customer.toUpperCase());

	const [filters, setFilters] = useState<Filter>({
		names,
		positions,
		types,
		customers: customersNames,
	});
	const totalPages =
		Math.ceil(
			groupedShifts.filter((shifts) => shouldIncludeShift(shifts[0])).length /
				100,
		) || 1;
	const [pages, setPages] = useState(1);

	const filtersArray = [
		{
			names: "Nombre",
			value: names,
			title: "Nombre",
			icon: IdentificationIcon,
		},
		{
			positions: "Cargo",
			value: positions,
			title: "Cargo",
			icon: RectangleGroupIcon,
		},
		{ types: "Tipo", value: types, title: "Tipo", icon: ShieldExclamationIcon },
		{
			customers: "Cliente",
			value: customersNames,
			title: "Cliente",
			icon: UserGroupIcon,
		},
	];

	function shouldIncludeShift(shift: ShiftWithId) {
		const workerNameFilter = filters.names.includes(
			shift.workerName.toUpperCase(),
		);
		const positionFilter =
			filters.positions.includes(shift.position?.toUpperCase() || "") ||
			filters.positions.includes(
				stalls
					.find((stall) => stall.id === shift.stall)
					?.workers.find((worker) => worker.id === shift.worker)
					?.position?.toUpperCase() || "",
			);

		const typeFilter = filters.types.includes(shift.abbreviation.toUpperCase());
		const customerName =
			stalls.find((stall) => stall.id === shift.stall)?.customerName ||
			customers.find((customer) => customer.id === shift.stall)?.name ||
			"";
		const customerFilter = filters.customers.includes(
			customerName.toUpperCase(),
		);

		return workerNameFilter && positionFilter && typeFilter && customerFilter;
	}

	const { generateExcel } = useExcel(
		groupedShifts.filter((shifts) => shouldIncludeShift(shifts[0])),
		customers,
		workers,
		stalls,
	);

	return (
		<Card className="p-0">
			{/* Filters */}
			<header className="flex justify-between items-center p-2">
				<div className="flex gap-2 items-center">
					<Icon
						size="sm"
						variant="solid"
						icon={ArrowDownCircleIcon}
						onClick={generateExcel}
						className="cursor-pointer"
						tooltip="Descargar Listado"
					/>
					{filtersArray.map((filter) => (
						<MultiSelect
							key={Object.keys(filter)[0]}
							icon={filter.icon}
							placeholder={filter.names}
							value={filters[Object.keys(filter)[0] as keyof Filter]}
							onValueChange={(value) =>
								setFilters({
									...filters,
									[Object.keys(filter)[0]]: value,
								})
							}
						>
							{filter.value.map((value) => (
								<MultiSelectItem key={`${filter.names}-${value}`} value={value}>
									{value}
								</MultiSelectItem>
							))}
						</MultiSelect>
					))}
				</div>
				<div className="flex gap-2 items-center">
					<Button
						size="sm"
						color="sky"
						variant="secondary"
						onClick={() => setPages(pages - 1)}
						disabled={pages === 1}
					>
						Anterior
					</Button>
					<Text className="text-lg font-medium">
						{pages} / {totalPages}
					</Text>
					<Button
						size="sm"
						color="sky"
						variant="secondary"
						onClick={() => setPages(pages + 1)}
						disabled={pages === totalPages}
					>
						Siguiente
					</Button>
				</div>
			</header>

			<Table>
				<TableHead>
					<TableRow>
						<TableHeaderCell>#</TableHeaderCell>
						<TableHeaderCell className="flex gap-2">Nombre</TableHeaderCell>
						<TableHeaderCell>Fechas</TableHeaderCell>
						<TableHeaderCell>Tipo</TableHeaderCell>
						<TableHeaderCell>Horas</TableHeaderCell>
						<TableHeaderCell>Cliente</TableHeaderCell>
						<TableHeaderCell>Puesto</TableHeaderCell>
						<TableHeaderCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{groupedShifts
						.filter((shifts) => shouldIncludeShift(shifts[0]))
						.slice((pages - 1) * 100, pages * 100)
						.map((shifts, index) => {
							const stall = stalls.find(
								(stall) => stall.id === shifts[0].stall,
							);
							const customer = customers.find(
								(customer) => customer.id === shifts[0].stall,
							);
							const worker = workers.find(
								(worker) => worker.id === shifts[0].worker,
							);
							const position =
								shifts[0].position ||
								stall?.workers.find((worker) => worker.id === shifts[0].worker)
									?.position;
							return (
								<>
									<TableRow
										key={`shifts-${index}`}
										className="font-medium uppercase"
									>
										<TableCell>
											{groupedShifts.findIndex(
												(s) => s[0].id === shifts[0].id,
											) + 1}
										</TableCell>
										<TableCell title="Nombre">
											<Text>{shifts[0].workerName}</Text>
											{worker?.identification} | {position || "-"}
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
										<TableCell
											title="Cliente"
											className="max-w-[200px] truncate"
										>
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
