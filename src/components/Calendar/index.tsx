import {
	AdjustmentsHorizontalIcon,
	CalendarIcon,
	FlagIcon,
	IdentificationIcon,
	MapPinIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
	Badge,
	Card,
	Grid,
	Icon,
	Select,
	SelectItem,
	Text,
	Title,
} from "@tremor/react";
import { useEffect, useState } from "react";
import CenteredModal from "../../common/CenteredModal";
import CustomToggle from "../../common/CustomToggle";
import { Dropdown, DropdownItem } from "../../common/DropDown";
import EmptyState from "../../common/EmptyState";
import { useAppSelector } from "../../hooks/store";
import { useCalendar, useCreateEvent } from "../../hooks/useCalendar";
import { useHandleStall, useStalls } from "../../hooks/useStalls";
import { getDays, months, years } from "../../utils/dates";
import { validateRoles } from "../../utils/roles";
import CreateEvents from "./CreateEvents";
import Customers from "./Customers";
import Events from "./Events";
import EventsTimeLine from "./EventsTimeLine";
import HandleStall from "./HandleStall";
import StallCalendar from "./StallCalendar";
import StallInfo from "./StallInfo";
import TimeLineInfo from "./TimeLineInfo";
import Workers from "./Workers";

export default function Calendar() {
	const { profile } = useAppSelector((state) => state.auth);
	const { customers } = useAppSelector((state) => state.customers);
	const { stalls } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const { events } = useAppSelector((state) => state.events);
	const calendarData = useCalendar(customers, profile, stalls, shifts);
	const { createStall } = useStalls(stalls, shifts);
	const { stallData, setStallData, handleCreateStall } = useHandleStall(
		calendarData.selectedMonth,
		calendarData.selectedYear,
		calendarData.actualCustomer,
	);
	const [selectedEventTab, setSelectedEventTab] = useState(0);
	const branchStalls = stalls.filter(
		(stall) => stall.branch === calendarData.selectedBranch,
	);
	const createEvent = useCreateEvent(
		setSelectedEventTab,
		calendarData.actualCustomer,
		stalls,
		calendarData.selectedMonth,
		calendarData.selectedYear,
		shifts,
	);

	const [openCreateStall, setOpenCreateStall] = useState(false);
	const [openCreateEvent, setOpenCreateEvent] = useState(false);
	const [openEvents, setOpenEvents] = useState(false);
	const [openCustomers, setOpenCustomers] = useState(false);
	const [openWorkers, setOpenWorkers] = useState(false);

	// Events Filters
	const [selectedEWorker, setSelectedEWorker] = useState<string>("");
	const [selectedWorkers, setSelectedWorkers] = useState<string>("");
	const [selectedTypes, setSelectedTypes] = useState<string[]>([
		"customer",
		"event",
	]);
	const [selectedAbbreviations, setSelectedAbbreviations] = useState<string[]>(
		[],
	);
	const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

	useEffect(() => {
		setSelectedAbbreviations(
			events.reduce((acc, event) => {
				if (acc.includes(event.abbreviation)) return acc;
				else return [...acc, event.abbreviation];
			}, [] as string[]),
		);
		setSelectedPositions(
			events.reduce((acc, event) => {
				if (acc.includes(event.position)) return acc;
				else return [...acc, event.position];
			}, [] as string[]),
		);
	}, [events]);

	const monthDays = getDays(
		calendarData.selectedMonth,
		calendarData.selectedYear,
	);
	const customerBranches = calendarData.actualCustomer?.branches || [];
	const branches = ["", ...customerBranches];

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
				["create_shifts", "handle_shifts", "admin"],
			),
		},
	];
	return (
		<Grid numItems={3} className="gap-2 h-full p-2 pt-4 grid-rows-1">
			<Card className=" col-span-2 bg-gray-50 p-2 overflow-y-auto">
				<header className="flex justify-between border-b pb-2">
					<div className="flex items-center gap-2">
						<CustomToggle
							enabled={calendarData.view === "events"}
							setEnabled={(value) =>
								calendarData.setView(value ? "events" : "stalls")
							}
							values={{ enabled: FlagIcon, disabled: MapPinIcon }}
						/>
						{calendarData.view === "stalls" && (
							<>
								<Select
									placeholder="Sede"
									value={calendarData.selectedBranch}
									onValueChange={(value) =>
										calendarData.setSelectedBranch(value)
									}
								>
									{branches.map((branch) => (
										<SelectItem key={`branch-${branch}`} value={branch}>
											{branch}
										</SelectItem>
									))}
								</Select>
								<Select
									placeholder="Puesto"
									value={calendarData.selectedStall}
									onValueChange={(value) =>
										calendarData.setSelectedStall(value)
									}
								>
									{branchStalls.map((stall) => (
										<SelectItem key={`stall-${stall.id}`} value={stall.id}>
											{stall.name}
										</SelectItem>
									))}
								</Select>
							</>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Select
							value={calendarData.selectedMonth}
							onValueChange={(value) => calendarData.setSelectedMonth(value)}
						>
							{months.map((month) => (
								<SelectItem key={`month-${month.value}`} value={month.value}>
									{month.name}
								</SelectItem>
							))}
						</Select>
						<Select
							value={calendarData.selectedYear}
							onValueChange={(value) => calendarData.setSelectedYear(value)}
						>
							{years.map((year) => (
								<SelectItem key={`year-${year}`} value={year.value}>
									{year.name}
								</SelectItem>
							))}
						</Select>
						{calendarData.view === "stalls" && (
							<>
								<Dropdown btnText="Opciones" position="right">
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
							</>
						)}
					</div>
				</header>
				{calendarData.view === "stalls" && !calendarData.actualStall && (
					<div className="mt-4">
						<EmptyState>
							<CalendarIcon className="w-10 h-10 text-sky-500" />
							<Title>
								Cree un puesto o seleccione uno para ver su calendario.
							</Title>
							<Text className="text-gray-600">
								Seleccione un puesto para ver su calendario, si no hay puestos
								creados, puede crear uno desde el botón de opciones.
							</Text>
						</EmptyState>
					</div>
				)}
				{calendarData.view === "stalls" && calendarData.actualStall && (
					<StallCalendar
						monthDays={monthDays}
						stall={calendarData.actualStall}
						selectedDay={calendarData.selectedDay}
						setSelectedDay={calendarData.setSelectedDay}
						selectedWorker={calendarData.selectedWorker}
					/>
				)}
				{calendarData.view === "events" && (
					<EventsTimeLine
						monthDays={monthDays}
						filters={{
							selectedEWorker,
							setSelectedEWorker,
							selectedWorkers,
							selectedTypes,
							selectedAbbreviations,
							selectedPositions,
						}}
					/>
				)}
			</Card>
			<Card className="bg-gray-50 p-2 overflow-y-auto">
				<header className="flex justify-between border-b h-12">
					{calendarData.view === "stalls" && (
						<>
							<div className="flex items-start gap-2">
								<Badge
									size="xl"
									color="sky"
									icon={UserGroupIcon}
									className="font-bold"
								>
									{calendarData.actualCustomer?.name}
								</Badge>
							</div>
							<div className="flex items-center gap-2">
								<>
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
									<Icon
										icon={FlagIcon}
										color="gray"
										size="md"
										className="cursor-pointer"
										variant="solid"
										onClick={() => setOpenEvents(!openEvents)}
									/>
								</>
							</div>
						</>
					)}
					{calendarData.view === "events" && (
						<div className="flex items-start gap-2">
							<Badge
								size="xl"
								color="sky"
								icon={FlagIcon}
								className="font-bold"
							>
								Filtros e información
							</Badge>
						</div>
					)}
				</header>
				{calendarData.view === "stalls" && !calendarData.actualStall && (
					<div className="mt-4">
						<EmptyState>
							<AdjustmentsHorizontalIcon className="w-10 h-10 text-sky-500" />
							<Title>
								Cree un puesto o seleccione uno para ver su información.
							</Title>
							<Text className="text-gray-600">
								Seleccione un puesto para ver su información, si no hay puestos
								creados, puede crear uno desde el botón de opciones.
							</Text>
						</EmptyState>
					</div>
				)}
				{calendarData.view === "stalls" && calendarData.actualStall && (
					<StallInfo
						stall={calendarData.actualStall}
						monthDays={monthDays}
						selectedDay={calendarData.selectedDay}
						selectedWorkerId={calendarData.selectedWorker}
						setSelectedWorkerId={calendarData.setSelectedWorker}
						selectedMonth={calendarData.selectedMonth}
						selectedYear={calendarData.selectedYear}
						actualCustomer={calendarData.actualCustomer}
					/>
				)}
				{calendarData.view === "events" && (
					<TimeLineInfo
						filters={{
							selectedEWorker,
							selectedWorkers,
							setSelectedWorkers,
							selectedTypes,
							setSelectedTypes,
							selectedAbbreviations,
							setSelectedAbbreviations,
							selectedPositions,
							setSelectedPositions,
						}}
					/>
				)}
			</Card>

			<Customers
				open={openCustomers}
				setOpen={setOpenCustomers}
				selected={calendarData.selectedCustomer}
				setSelected={calendarData.setSelectedCustomer}
			/>
			<Workers open={openWorkers} setOpen={setOpenWorkers} />
			<Events
				open={openEvents}
				setOpen={setOpenEvents}
				customer={calendarData.actualCustomer?.name}
			/>
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
					branches={calendarData.actualCustomer?.branches || []}
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
				<CreateEvents
					createEvent={createEvent}
					selectedTab={selectedEventTab}
					setSelectedTab={setSelectedEventTab}
				/>
			</CenteredModal>
		</Grid>
	);
}
