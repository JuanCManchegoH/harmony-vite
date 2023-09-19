import {
	ArrowDownCircleIcon,
	CalendarIcon,
	InformationCircleIcon,
	RectangleGroupIcon,
	ShieldExclamationIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
	Badge,
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
import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "../../hooks/store";
import { groupDates } from "../../utils/dates";
import { getDiference } from "../../utils/hours";

export interface WorkerListFilters {
	abbsList: string[];
	selectedAbbreviations: string[];
	setSelectedAbbreviations: Dispatch<SetStateAction<string[]>>;
	positionsList: string[];
	selectedPositions: string[];
	setSelectedPositions: Dispatch<SetStateAction<string[]>>;
	selectedCustomers: string[];
	setSelectedCustomers: Dispatch<SetStateAction<string[]>>;
}

export default function WorkersList({
	page,
	setPage,
	filters,
	generateExcel,
}: {
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	filters: WorkerListFilters;
	generateExcel: () => void;
}) {
	const { groupsToShow, stalls, groupedShiftsLength } = useAppSelector(
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
		<Card className="p-0 bg-gray-50">
			<header className="flex justify-between items-center">
				<div className="flex gap-2 items-center p-2">
					<Icon
						size="sm"
						variant="solid"
						icon={ArrowDownCircleIcon}
						onClick={generateExcel}
						className="cursor-pointer"
						tooltip="Descargar Listado"
					/>
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
				</div>
				{totalPages > 1 && (
					<div className="flex gap-2 items-center p-2">
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
			<Table className="bg-gray-50">
				<TableHead className="border-b">
					<TableRow>
						<TableHeaderCell>#</TableHeaderCell>
						<TableHeaderCell className="flex gap-2">Nombre</TableHeaderCell>
						<TableHeaderCell>Tipo</TableHeaderCell>
						<TableHeaderCell>Horas</TableHeaderCell>
						<TableHeaderCell>Cliente</TableHeaderCell>
						<TableHeaderCell>Puesto</TableHeaderCell>
						<TableHeaderCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{groupsToShow.map((shifts, index) => {
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
								<TableRow
									key={`shifts-${index}-${shifts[0].id}`}
									className="font-medium uppercase"
								>
									<TableCell>
										{groupsToShow.findIndex((s) => s[0].id === shifts[0].id) +
											1}
									</TableCell>
									<TableCell title="Nombre">
										<Text>{shifts[0].workerName}</Text>
										{position}
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
									<TableCell className="flex flex-col items-end gap-1">
										<Badge
											icon={CalendarIcon}
											color="gray"
											tooltip={groupDates(
												shifts.map((shift) => shift.day),
											).join(" | ")}
										>
											Fechas
										</Badge>
										{shifts[0].description && (
											<Badge
												icon={InformationCircleIcon}
												color="gray"
												tooltip={shifts[0].description}
											>
												Info
											</Badge>
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
