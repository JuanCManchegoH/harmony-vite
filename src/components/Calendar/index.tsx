import {
	AdjustmentsHorizontalIcon,
	CalendarIcon,
	FlagIcon,
	IdentificationIcon,
	MapPinIcon,
	RocketLaunchIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
	Badge,
	Card,
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
import {
	useCalendar,
	useCreateEvent,
	usePropose,
} from "../../hooks/useCalendar";
import { useHandleStall, useStalls } from "../../hooks/useStalls";
import classNames from "../../utils/classNames";
import { getDays, months, years } from "../../utils/dates";
import { validateRoles } from "../../utils/roles";
import CreateEvents from "./CreateEvents";
import Customers from "./Customers";
import Events from "./Events";
import EventsTimeLine from "./EventsTimeLine";
import HandleStall from "./HandleStall";
import Propose from "./Propose";
import StallCalendar from "./StallCalendar";
import StallInfo from "./StallInfo";
import TimeLineInfo from "./TimeLineInfo";
import Workers from "./Workers";

export default function Calendar({ display }: { display: boolean }) {
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
		branchStalls,
		stalls,
		calendarData.selectedMonth,
		calendarData.selectedYear,
		shifts,
	);
	const propose = usePropose(stalls, shifts);

	const [openCreateStall, setOpenCreateStall] = useState(false);
	const [openCreateEvent, setOpenCreateEvent] = useState(false);
	const [openEvents, setOpenEvents] = useState(false);
	const [openPropose, setOpenPropose] = useState(false);
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
			show: validateRoles(profile.roles, [], ["handle_stalls"]),
			shortcut: "P",
		},
		{
			icon: FlagIcon,
			name: "Crear evento",
			action: () => setOpenCreateEvent(true),
			show: validateRoles(
				profile.roles,
				[],
				["create_shifts", "handle_shifts"],
			),
			shortcut: "E",
		},
		{
			icon: RocketLaunchIcon,
			name: "Programar nuevo mes",
			action: () => setOpenPropose(true),
			show:
				validateRoles(profile.roles, [], ["handle_stalls"]) && stalls.length,
		},
	];

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isInInput = ["INPUT", "SELECT", "TEXTAREA"].includes(
				(event.target as HTMLElement).tagName,
			);
			const key = event.key.toUpperCase();

			if (
				key === "P" &&
				!isInInput &&
				validateRoles(profile.roles, [], ["handle_stalls"])
			) {
				setOpenCreateStall(true);
			} else if (
				key === "E" &&
				!isInInput &&
				validateRoles(profile.roles, [], ["create_shifts", "handle_shifts"])
			) {
				setOpenCreateEvent(true);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [profile.roles]);

	return (
		<>
			<Card
				className={classNames(
					" col-span-2 bg-gray-50 p-2 overflow-y-auto",
					display ? "" : "hidden",
				)}
			>
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
						{calendarData.view === "stalls" &&
							validateRoles(
								profile.roles,
								[],
								["handle_stalls", "create_shifts", "handle_shifts"],
							) && (
								<>
									<Dropdown btnText="Opciones" position="right">
										{options
											.filter((option) => option.show)
											.map((option) => (
												<DropdownItem
													key={option.name}
													icon={option.icon}
													onClick={option.action}
													shortcut={option.shortcut}
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
			<Card
				className={classNames(
					"bg-gray-50 p-2 overflow-y-auto",
					display ? "" : "hidden",
				)}
			>
				<header className="grid grid-cols-3 border-b h-12 gap-2">
					{calendarData.view === "stalls" && (
						<>
							<div className="col-span-2 flex items-start gap-2">
								<Title
									className="truncate underline"
									title={calendarData.actualCustomer?.name}
								>
									{calendarData.actualCustomer?.name}
								</Title>
							</div>
							<div className="flex items-start gap-2 justify-end">
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
			<CenteredModal
				open={openPropose}
				setOpen={setOpenPropose}
				title="Programar nuevo mes"
				btnText="Programar"
				icon={RocketLaunchIcon}
				action={() => propose.handlePropose()}
			>
				<Propose
					targetMonth={propose.targetMonth}
					setTargetMonth={propose.setTargetMonth}
					targetYear={propose.targetYear}
					setTargetYear={propose.setTargetYear}
				/>
			</CenteredModal>
		</>
	);
}
