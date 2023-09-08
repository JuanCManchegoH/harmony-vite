import {
	FlagIcon,
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
import { validateRoles } from "../../utils/roles";
import CreateEvents from "./CreateEvents";
import Customers from "./Customers";
import Events from "./Events";
import Stalls from "./Stalls";
import HandleStall from "./Stalls/HandleStall";
import Workers from "./Workers";

export const eventTypes = ["event", "customer"];

export default function Plans() {
	const { profile } = useAppSelector((state) => state.auth);
	const { customers } = useAppSelector((state) => state.customers);
	const { plansStalls } = useAppSelector((state) => state.stalls);
	const { plansShifts } = useAppSelector((state) => state.shifts);
	const plansData = usePlans(customers, profile, plansStalls, plansShifts);
	const { createStall } = useStalls(plansStalls, plansShifts);
	const { stallData, setStallData, handleCreateStall } = useHandleStall(
		plansData.selectedMonth,
		plansData.selectedYear,
		plansData.actualCustomer,
	);
	const createEvent = useCreateEvent(
		plansData.actualCustomer,
		plansStalls,
		plansData.selectedMonth,
		plansData.selectedYear,
		plansShifts,
	);
	const events = plansShifts.filter((shift) => eventTypes.includes(shift.type));
	const [openCustomers, setOpenCustomers] = useState(false);
	const [openWorkers, setOpenWorkers] = useState(false);
	const [openEvents, setOpenEvents] = useState(false);
	const [openCreateStall, setOpenCreateStall] = useState(false);
	const [openCreateEvent, setOpenCreateEvent] = useState(false);

	// const [openSuggestNextMonth, setOpenSuggestNextMonth] = useState(false);

	const options = [
		{
			icon: MapPinIcon,
			name: "Crear puesto",
			action: () => setOpenCreateStall(true),
			show: validateRoles(profile.roles, [], ["handle_stalls", "admin"]),
		},
		{
			icon: FlagIcon,
			name: "Crear evento",
			action: () => setOpenCreateEvent(true),
			show: validateRoles(
				profile.roles,
				[],
				["handle_stalls", "handle_events", "admin"],
			),
		},
		// {
		// 	icon: ForwardIcon,
		// 	name: "Próximo mes",
		// 	action: () => setOpenSuggestNextMonth(true),
		// },
	];

	return (
		<Grid numItems={1} className="gap-2 h-full p-2 pt-4">
			<Card className="p-1 overflow-y-auto bg-gray-50">
				<header className="flex justify-end gap-2 border rounded-md p-1 sticky top-0 bg-gray-50 z-10">
					<label
						htmlFor="name"
						className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-block rounded-full border px-2 bg-gray-50 text-xs font-medium text-gray-900"
					>
						{plansData.actualCustomer?.name}
					</label>
					{validateRoles(
						profile.roles,
						[],
						["handle_stalls", "handle_events", "admin"],
					) &&
						plansData.actualCustomer && (
							<div className="flex absolute left-1 gap-2">
								<Dropdown btnText="Opciones">
									{options
										.filter((option) => option.show)
										.map((option) => (
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
					{plansData.actualCustomer && events.length > 0 && (
						<Icon
							icon={FlagIcon}
							color="gray"
							size="md"
							className="cursor-pointer"
							variant="solid"
							onClick={() => setOpenEvents(!openEvents)}
						/>
					)}
				</header>
				<main className="py-2">
					{plansData.actualCustomer && <Stalls plansData={plansData} />}
					{!plansData.actualCustomer && (
						<EmptyState>
							<MapPinIcon className="w-8 h-8 text-sky-500" />
							<Text className="text-gray-600">Selecciona un cliente</Text>
							<Text className="text-gray-400">
								Para seleccionar un cliente, haz click en el icono de 'Clientes'
							</Text>
						</EmptyState>
					)}
					{plansData.actualCustomer && plansStalls.length <= 0 && (
						<EmptyState>
							<MapPinIcon className="w-8 h-8 text-sky-500" />
							<Text className="text-gray-600">Aqui aparecerán los puestos</Text>
							<Text className="text-gray-400">
								Para agregar un puesto, despliega el menú de opciones y haz
								click en 'Crear puesto'
							</Text>
						</EmptyState>
					)}
				</main>
			</Card>
			<Customers
				open={openCustomers}
				setOpen={setOpenCustomers}
				selected={plansData.selected}
				setSelected={plansData.setSelected}
			/>
			<Workers open={openWorkers} setOpen={setOpenWorkers} />
			<Events open={openEvents} setOpen={setOpenEvents} />
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
				<CreateEvents createEvent={createEvent} />
			</CenteredModal>
		</Grid>
	);
}
