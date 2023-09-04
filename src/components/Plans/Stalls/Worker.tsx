import {
	BackspaceIcon,
	BoltIcon,
	CalendarDaysIcon,
	IdentificationIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { eventTypes } from "..";
import CenteredModal from "../../../common/CenteredModal";
import Tracker, { TrackerItem } from "../../../common/Tracker";
import { useAppSelector } from "../../../hooks/store";
import { useHandleShifts, useShifts } from "../../../hooks/useShifts";
import { useStalls } from "../../../hooks/useStalls";
import { StallWithId, StallWorker } from "../../../services/stalls/types";
import { DateToSring, MonthDay, getDay } from "../../../utils/dates";
import { validateRoles } from "../../../utils/roles";
import CalendarUpdate from "./CalendarUpdate";
import DeleteShifts from "./DeleteShifts";
import Info from "./Info";
import SelectSequence from "./SelectSequence";

export default function Worker({
	worker,
	monthDays,
	stall,
	schedules,
	setHoverSchedule,
}: {
	worker: StallWorker;
	monthDays: MonthDay[];
	stall: StallWithId;
	schedules: { startTime: string; endTime: string }[];
	setHoverSchedule: Dispatch<SetStateAction<string>>;
}) {
	const { profile } = useAppSelector((state) => state.auth);
	const { stalls } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const { createAndUpdate, deleteMany } = useShifts(shifts, stalls);
	const { removeWorker } = useStalls(stalls, shifts);
	const {
		shiftsData,
		setShiftsData,
		selectedDays,
		setSelectedDays,
		handleCreateAndUpdate,
		selectedSequence,
		setSelectedSequence,
		selectedIndex,
		setSelectedIndex,
		jump,
		setJump,
		handleSequence,
		selectedDelete,
		setSelectedDelete,
		handleDeleteShifts,
	} = useHandleShifts(shifts, worker, stall, monthDays);
	const workerShifts = shifts.filter(
		(shift) =>
			shift.worker === worker.id &&
			shift.stall === stall.id &&
			!eventTypes.includes(shift.type),
	);
	const workerEvents = shifts.filter(
		(shift) =>
			shift.worker === worker.id &&
			shift.stall === stall.id &&
			eventTypes.includes(shift.type),
	);
	const [openInfo, setOpenInfo] = useState(false);
	const [openCalendar, setOpenCalendar] = useState(false);
	const [openSequence, setOpenSequence] = useState<boolean>(false);
	const [openDelete, setOpenDelete] = useState(false);

	const data: TrackerItem[] = monthDays.map((day) => {
		const shift = workerShifts.find(
			(shift) => shift.day === DateToSring(day.date),
		);
		return {
			key: getDay(day.date),
			tooltip: shift?.description || day.day,
			color: shift?.color || "gray",
			content: shift?.abbreviation || "-",
			startTime: shift?.startTime || "",
			endTime: shift?.endTime || "",
		};
	});

	return (
		<div className="flex z-10 relative pt-4 m-2">
			<label className="absolute -top-2 flex items-center bg-gray-50 px-1 text-sm font-medium text-gray-900 uppercase gap-2">
				<IdentificationIcon
					className="w-5 h-5 text-sky-500 hover:text-sky-600 cursor-pointer"
					onClick={() => setOpenInfo(true)}
				/>
				{validateRoles(profile.roles, ["handle_stalls"], []) && (
					<>
						<CalendarDaysIcon
							className="w-5 h-5 text-sky-500 hover:text-sky-600 cursor-pointer"
							onClick={() => setOpenCalendar(true)}
						/>
						<BoltIcon
							className="w-5 h-5 text-sky-500 hover:text-sky-600 cursor-pointer"
							onClick={() => setOpenSequence(true)}
						/>
						<BackspaceIcon
							className="w-5 h-5 text-sky-500 hover:text-sky-600 cursor-pointer"
							onClick={() => setOpenDelete(true)}
						/>
					</>
				)}
				{worker.name} - {worker.identification}
			</label>
			<div className="bg-gray-50 absolute -top-2 right-0 flex">
				<XMarkIcon
					className="w-5 h-5 hover:text-rose-400 cursor-pointer"
					onClick={() =>
						toast("Confirmar eliminacion", {
							action: {
								label: "Eliminar",
								onClick: () =>
									removeWorker(
										stall.id,
										worker.id,
										[...workerShifts, ...workerEvents].map((shift) => shift.id),
									),
							},
						})
					}
				/>
			</div>
			<Tracker
				data={data}
				schedules={schedules}
				setHoverSchedule={setHoverSchedule}
			/>
			<CenteredModal
				open={openCalendar}
				setOpen={setOpenCalendar}
				icon={CalendarDaysIcon}
				title="Actualización por calendario"
				btnText="Actualizar"
				action={() => handleCreateAndUpdate(createAndUpdate)}
			>
				<CalendarUpdate
					monthDays={monthDays}
					selectedDays={selectedDays}
					setSelectedDays={setSelectedDays}
					data={shiftsData}
					setData={setShiftsData}
				/>
			</CenteredModal>
			<CenteredModal
				open={openSequence}
				setOpen={setOpenSequence}
				icon={BoltIcon}
				title="Secuencias"
				btnText="Actualizar"
				action={() => handleSequence(createAndUpdate)}
			>
				<form className="grid grid-cols-2 gap-2">
					<SelectSequence
						monthDays={monthDays}
						selectedSequence={selectedSequence}
						setSelectedSequence={setSelectedSequence}
						selectedIndex={selectedIndex}
						setSelectedIndex={setSelectedIndex}
						jump={jump}
						setJump={setJump}
					/>
				</form>
			</CenteredModal>
			<CenteredModal
				open={openInfo}
				setOpen={setOpenInfo}
				icon={IdentificationIcon}
				title="Información de la persona"
			>
				<Info worker={worker} shifts={workerShifts} />
			</CenteredModal>
			<CenteredModal
				open={openDelete}
				setOpen={setOpenDelete}
				icon={BackspaceIcon}
				title="Eliminar Turnos"
				btnText="Eliminar"
				action={() => handleDeleteShifts(deleteMany, stall.id)}
			>
				<DeleteShifts
					shifts={workerShifts}
					selectedDelete={selectedDelete}
					setSelectedDelete={setSelectedDelete}
				/>
			</CenteredModal>
		</div>
	);
}
