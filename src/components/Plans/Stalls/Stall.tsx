import {
	ClockIcon,
	IdentificationIcon,
	PencilSquareIcon,
	TagIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { Badge, Card, Text, Title } from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import { eventTypes } from "..";
import CenteredModal from "../../../common/CenteredModal";
import { Dropdown, DropdownItem } from "../../../common/DropDown";
import EmptyState from "../../../common/EmptyState";
import Ping from "../../../common/Ping";
import { PlansData } from "../../../hooks/Handlers/usePlans";
import { useAppSelector } from "../../../hooks/store";
import {
	useHandleStall,
	useHandleStallWorker,
	useStalls,
} from "../../../hooks/useStalls";
import { StallWithId } from "../../../services/stalls/types";
import classNames from "../../../utils/classNames";
import { colorOps } from "../../../utils/colors";
import { DateToSring, getDay, getDays } from "../../../utils/dates";
import {
	getDiference,
	getSchedules,
	minutesToString,
} from "../../../utils/hours";
import { validateRoles } from "../../../utils/roles";
import AddStallWorker from "./AddStallWorker";
import HandleStall from "./HandleStall";
import Worker from "./Worker";

export interface WorkerData {
	position: string;
	mode: string;
}

export default function Stall({
	stall,
	plansData,
}: { stall: StallWithId; plansData: PlansData }) {
	const { profile } = useAppSelector((state) => state.auth);
	const { stalls } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const { updateStall, addWorker, deleteStall } = useStalls(stalls, shifts);
	const { stallData, setStallData, handleUpdateStall } = useHandleStall(
		plansData.selectedMonth,
		plansData.selectedYear,
		plansData.actualCustomer,
		stall,
	);
	const {
		selectedWorker,
		setSelectedWorker,
		position,
		setPosition,
		handleAddWorker,
	} = useHandleStallWorker();
	const stallShifts = shifts.filter((shift) => shift.stall === stall.id);
	const stallEvents = shifts.filter(
		(shift) => shift.stall === stall.id && eventTypes.includes(shift.type),
	);
	const schedules = [
		{ startTime: "00:00", endTime: "00:00" },
		...getSchedules(stallShifts),
	];
	const monthDays = getDays(stall.month, stall.year);
	const [hoverSchedule, setHoverSchedule] = useState<string>("");
	const [openUpdate, setOpenUpdate] = useState(false);
	const [openAddWorker, setOpenAddWorker] = useState(false);

	const options = [
		{
			icon: IdentificationIcon,
			name: "Agregar Persona",
			action: () => setOpenAddWorker(true),
		},
		{
			icon: PencilSquareIcon,
			name: "Editar puesto",
			action: () => setOpenUpdate(true),
		},
		{
			icon: XMarkIcon,
			name: "Eliminar",
			action: () =>
				toast("Elminar puesto, turnos y eventos relacionados.", {
					action: {
						label: "Eliminar",
						onClick: () =>
							deleteStall(
								stall.id,
								shifts
									.filter((shift) => shift.stall === stall.id)
									.map((shift) => shift.id),
								stalls,
							),
					},
				}),
		},
	];

	return (
		<Card className="p-2 flex flex-col gap-1 bg-transparent relative">
			<header className="flex justify-between">
				<div className="flex gap-2 items-center">
					<Title color="sky">{stall.name}</Title>
					{stall.branch && (
						<Badge color="sky" size="xs">
							{stall.branch}
						</Badge>
					)}
					{stall.tag && (
						<Badge color="sky" size="xs" icon={TagIcon}>
							{stall.tag}
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-2">
					{validateRoles(profile.roles, [], ["handle_stalls", "admin"]) && (
						<Dropdown btnText="Acciones" position="right">
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
					)}
				</div>
			</header>
			<section className="flex gap-2">
				{schedules.map((schedule, i) => {
					const content =
						schedule.startTime === schedule.endTime
							? "Sin Horario"
							: `${i + 1} - ${schedule.startTime} - ${schedule.endTime}`;
					return (
						<Badge
							icon={ClockIcon}
							key={`${schedule.startTime}-${schedule.endTime}`}
							color={
								hoverSchedule === `${schedule.startTime}-${schedule.endTime}`
									? "sky"
									: "gray"
							}
							size="xs"
						>
							{content}
						</Badge>
					);
				})}
			</section>
			<section className="flex justify-between mx-2">
				{monthDays.map((day) => (
					<div
						key={`${stall.id}-day-${getDay(day.date)}`}
						className={classNames(
							day.isHoliday ? "text-rose-400" : "",
							"flex w-full flex-col items-center font-semibold text-sm relative",
						)}
					>
						{stallEvents.some(
							(event) => event.day === DateToSring(day.date),
						) && <Ping color="sky" />}
						<p>{day.day.substring(0, 2)}</p>
						<p>{getDay(day.date)}</p>
					</div>
				))}
			</section>
			<main className="flex flex-col gap-1 z-10">
				{stall.workers.length <= 0 && (
					<EmptyState>
						<IdentificationIcon className="w-10 h-10 text-sky-500" />
						<Text className="text-gray-600">
							Aquí aparecerá el personal asignado
						</Text>
						<Text className="text-gray-400">
							Puedes asignar personas desde el botón de acciones
						</Text>
					</EmptyState>
				)}
				{stall.workers.map((worker) => (
					<Worker
						key={worker.id}
						worker={worker}
						monthDays={monthDays}
						stall={stall}
						schedules={schedules}
						setHoverSchedule={setHoverSchedule}
					/>
				))}
				{stall.workers.length > 0 && (
					<div className="flex justify-between mx-2">
						{monthDays.map((day) => {
							const minutes = stallShifts
								.filter(
									(shift) =>
										shift.day === DateToSring(day.date) &&
										shift.stall === stall.id,
								)
								.reduce((acc, shift) => {
									if (colorOps.add.includes(shift.color)) {
										return (
											acc + getDiference(shift.startTime, shift.endTime).minutes
										);
									}
									if (colorOps.sub.includes(shift.color)) {
										return (
											acc - getDiference(shift.startTime, shift.endTime).minutes
										);
									}
									return acc;
								}, 0);
							return (
								<div
									key={`stall${stall.id}hours${getDay(day.date)})}`}
									className="flex items-center w-full px-1"
								>
									<div className="text-xs bg-white rounded-md ring-1 ring-inset ring-gray-500 w-full text-center font-semibold">
										{minutesToString(minutes)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</main>
			{/* Backlines & Hours */}
			{stall.workers.length > 0 && (
				<div className="flex justify-between mx-2">
					{monthDays.map((day) => (
						<div
							key={`stall${stall.id}line${getDay(day.date)})}`}
							className="flex flex-col items-center w-full"
						>
							<div
								className={classNames(
									"absolute top-32 mt-2.5 bottom-0 border-l-2 z-0",
									day.isHoliday ? "border-red-200" : "border-neutral-200",
								)}
							/>
						</div>
					))}
				</div>
			)}
			<CenteredModal
				open={openUpdate}
				setOpen={setOpenUpdate}
				icon={PencilSquareIcon}
				title="Editar puesto"
				btnText="Editar"
				action={() => handleUpdateStall(updateStall, stall.id)}
			>
				<HandleStall
					data={stallData}
					setData={setStallData}
					branches={plansData.actualCustomer?.branches || []}
				/>
			</CenteredModal>
			<CenteredModal
				open={openAddWorker}
				setOpen={setOpenAddWorker}
				icon={IdentificationIcon}
				title="Asignar persona"
				btnText="Asignar"
				action={() => handleAddWorker(addWorker, stall.id)}
			>
				<AddStallWorker
					position={position}
					setPosition={setPosition}
					selectedWorker={selectedWorker}
					setSelectedWorker={setSelectedWorker}
				/>
			</CenteredModal>
		</Card>
	);
}
