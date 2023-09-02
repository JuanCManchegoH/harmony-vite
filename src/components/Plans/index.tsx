import {
	FlagIcon,
	ForwardIcon,
	IdentificationIcon,
	MapPinIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Card, Grid, Icon, Select, SelectItem, Text } from "@tremor/react";
import { useState } from "react";
import CenteredModal from "../../common/CenteredModal";
import { Dropdown, DropdownItem } from "../../common/DropDown";
import EmptyState from "../../common/EmptyState";
import { useCreateEvent, usePlans } from "../../hooks/Handlers/usePlans";

import { useAppSelector } from "../../hooks/store";
import { useHandleStall, useStalls } from "../../hooks/useStalls";
import { months, years } from "../../utils/dates";
import Customers from "./Customers";
import Events from "./Events";
import Stalls from "./Stalls";
import HandleStall from "./Stalls/HandleStall";
import Workers from "./Workers";

export default function Plans() {
	const { profile } = useAppSelector((state) => state.auth);
	const { customers } = useAppSelector((state) => state.customers);
	const { stalls } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const plansData = usePlans(customers, profile, stalls);
	const { createStall } = useStalls(stalls);
	const { stallData, setStallData, handleCreateStall } = useHandleStall(
		plansData.selectedMonth,
		plansData.selectedYear,
		plansData.actualCustomer,
	);
	const createEvent = useCreateEvent(
		plansData.actualCustomer,
		stalls,
		plansData.selectedMonth,
		plansData.selectedYear,
		shifts,
	);
	const [openCustomers, setOpenCustomers] = useState(false);
	const [openWorkers, setOpenWorkers] = useState(false);
	const [openCreateStall, setOpenCreateStall] = useState(false);
	const [openCreateEvent, setOpenCreateEvent] = useState(false);
	const [openSuggestNextMonth, setOpenSuggestNextMonth] = useState(false);

	const options = [
		{
			icon: MapPinIcon,
			name: "Crear puesto",
			action: () => setOpenCreateStall(true),
		},
		{
			icon: FlagIcon,
			name: "Crear evento",
			action: () => setOpenCreateEvent(true),
		},
		{
			icon: ForwardIcon,
			name: "Próximo mes",
			action: () => setOpenSuggestNextMonth(true),
		},
	];

	return (
		<Grid numItems={1} className="gap-2 h-full p-2">
			<Card className="p-1 overflow-y-auto bg-gray-50">
				<header className="flex justify-end gap-2 border rounded-md p-1 sticky top-0 z-10 bg-gray-50">
					<label
						htmlFor="name"
						className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-block rounded-full border px-2 bg-gray-50 text-xs font-medium text-gray-900"
					>
						{plansData.actualCustomer?.name}
					</label>
					{plansData.actualCustomer && (
						<div className="flex absolute left-1 gap-2">
							<Dropdown btnText="Opciones">
								{options.map((option) => (
									<DropdownItem
										key={option.name}
										icon={option.icon}
										onClick={option.action}
									>
										{option.name}
									</DropdownItem>
								))}
							</Dropdown>
						</div>
					)}
					<div className="flex gap-2">
						<Select
							value={plansData.selectedMonth}
							onValueChange={(value) => plansData.setSelectedMonth(value)}
						>
							{months.map((month) => (
								<SelectItem key={`month-${month.value}`} value={month.value}>
									{month.name}
								</SelectItem>
							))}
						</Select>
						<Select
							value={plansData.selectedYear}
							onValueChange={(value) => plansData.setSelectedYear(value)}
						>
							{years.map((year) => (
								<SelectItem key={`year-${year}`} value={year.value}>
									{year.name}
								</SelectItem>
							))}
						</Select>
					</div>
					<Icon
						icon={UserGroupIcon}
						color="gray"
						size="md"
						className="cursor-pointer"
						variant="solid"
						onClick={() => setOpenCustomers(!openCustomers)}
					/>
					<Icon
						icon={IdentificationIcon}
						color="gray"
						size="md"
						className="cursor-pointer"
						variant="solid"
						onClick={() => setOpenWorkers(!openWorkers)}
					/>
				</header>
				<main className="py-2">
					{stalls.length <= 0 && (
						<EmptyState>
							<MapPinIcon className="w-8 h-8 text-sky-500" />
							<Text className="text-gray-600">
								{plansData.actualCustomer
									? "Aqui aparecerán los puestos"
									: "Selecciona un cliente"}
							</Text>
							<Text className="text-gray-400">
								{plansData.actualCustomer
									? "Para agregar un puesto, despliega el menú de opciones y haz click en 'Crear puesto'"
									: "Para seleccionar un cliente, haz click en el icono de 'Clientes'"}
							</Text>
						</EmptyState>
					)}
					<Stalls plansData={plansData} />
				</main>
			</Card>
			<Customers
				open={openCustomers}
				setOpen={setOpenCustomers}
				selected={plansData.selected}
				setSelected={plansData.setSelected}
			/>
			<Workers open={openWorkers} setOpen={setOpenWorkers} />
			<CenteredModal
				open={openCreateStall}
				setOpen={setOpenCreateStall}
				title="Crear puesto"
				btnText="Crear"
				icon={MapPinIcon}
				action={() => handleCreateStall(createStall)}
			>
				<HandleStall
					data={stallData}
					setData={setStallData}
					branches={plansData.actualCustomer?.branches || []}
					creation
				/>
			</CenteredModal>
			<CenteredModal
				open={openCreateEvent}
				setOpen={setOpenCreateEvent}
				title="Crear evento"
				btnText="Crear"
				icon={FlagIcon}
				action={createEvent.handleCreateEvent}
			>
				<Events createEvent={createEvent} />
			</CenteredModal>
		</Grid>
	);
}
