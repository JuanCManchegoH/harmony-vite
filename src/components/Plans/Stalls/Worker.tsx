import {
	BoltIcon,
	CalendarDaysIcon,
	IdentificationIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import Calendar from "../../../common/Calendar";
import CenteredModal from "../../../common/CenteredModal";
import SelectHours, { Times } from "../../../common/SelectHours";
import Tracker, { TrackerItem } from "../../../common/Tracker";
import { useAppSelector } from "../../../hooks/store";
import { useShifts } from "../../../hooks/useShifts";
import { useStalls } from "../../../hooks/useStalls";
import { Sequence } from "../../../services/company/types";
import { StallWorker } from "../../../services/stalls/types";
import { DateToSring, MonthDay, getDay } from "../../../utils/dates";
import { getHour } from "../../../utils/hours";
import Info from "./Info";
import SelectSequence from "./SelectSequence";

export default function Worker({
	worker,
	monthDays,
	stallId,
	schedules,
	setHoverSchedule,
}: {
	worker: StallWorker;
	monthDays: MonthDay[];
	stallId: string;
	schedules: { startTime: string; endTime: string }[];
	setHoverSchedule: Dispatch<SetStateAction<string>>;
}) {
	const { stalls } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const { createAndUpdate } = useShifts();
	const [openInfo, setOpenInfo] = useState(false);
	const [selectedSequence, setSelectedSequence] = useState<Sequence>();
	const [selectedIndex, setSelectedIndex] = useState<number>(1);
	const [openSequence, setOpenSequence] = useState<boolean>(false);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [openCalendar, setOpenCalendar] = useState(false);
	const [isShift, setIsShift] = useState<boolean>(true);
	const { removeWorker } = useStalls(stalls);
	const [times, setTimes] = useState<Times>({
		selectedStartHour: "6",
		selectedStartMinute: "0",
		selectedEndHour: "18",
		selectedEndMinute: "0",
	});
	const data: TrackerItem[] = monthDays.map((day) => {
		const shift = shifts.find(
			(shift) =>
				shift.day === DateToSring(day.date) &&
				shift.worker === worker.id &&
				shift.stall === stallId,
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

	const handleCreateAndUpdate = () => {
		const commonData = {
			startTime: isShift
				? `${getHour(times.selectedStartHour)}:${getHour(
						times.selectedStartMinute,
				  )}`
				: "00:00",
			endTime: isShift
				? `${getHour(times.selectedEndHour)}:${getHour(
						times.selectedEndMinute,
				  )}`
				: "00:00",
			color: isShift ? "green" : ("gray" as "green" | "gray"),
			abbreviation: isShift ? "T" : "X",
			description: isShift ? "Turno" : "Descanso",
			mode: "proyeccion",
			type: isShift ? "shift" : "rest",
			active: true,
			keep: true,
		};
		const create = selectedDays
			.filter(
				(day) =>
					!shifts.find(
						(shift) =>
							shift.day === day &&
							shift.worker === worker.id &&
							shift.stall === stallId,
					),
			)
			.map((day) => ({
				day,
				...commonData,
				worker: worker.id,
				stall: stallId,
				position: "",
				sequence: "",
			}));
		const update = selectedDays
			.filter((day) =>
				shifts.find(
					(shift) =>
						shift.day === day &&
						shift.worker === worker.id &&
						shift.stall === stallId,
				),
			)
			.map((day) => ({
				id: shifts.find(
					(shift) =>
						shift.day === day &&
						shift.worker === worker.id &&
						shift.stall === stallId,
				)?.id as string,
				...commonData,
			}));
		createAndUpdate(create, update, shifts).then((res) => {
			if (res) {
				setSelectedDays([]);
			}
		});
	};

	const handleSequence = () => {
		const sequenceShifts = monthDays.map((day, i) => {
			const step =
				selectedSequence?.steps[
					(i + selectedIndex - 1) % (selectedSequence?.steps.length || 0)
				];
			return {
				day: DateToSring(day.date),
				startTime: step?.startTime || "",
				endTime: step?.endTime || "",
				color: step?.color || "gray",
			};
		});
		const create = sequenceShifts
			.filter(
				(shift) =>
					!shifts.find(
						(s) =>
							s.day === shift.day &&
							s.worker === worker.id &&
							s.stall === stallId,
					),
			)
			.map((shift) => ({
				...shift,
				worker: worker.id,
				stall: stallId,
				mode: "proyeccion",
				type: shift.color === "green" ? "shift" : "rest",
				abbreviation: shift.color === "green" ? "T" : "X",
				description: shift.color === "green" ? "Turno" : "Descanso",
				active: true,
				keep: true,
				position: "",
				sequence: "",
			}));

		const update = sequenceShifts
			.filter((shift) =>
				shifts.find(
					(s) =>
						s.day === shift.day &&
						s.worker === worker.id &&
						s.stall === stallId,
				),
			)
			.map((shift) => ({
				id: shifts.find(
					(s) =>
						s.day === shift.day &&
						s.worker === worker.id &&
						s.stall === stallId,
				)?.id as string,
				startTime: shift.startTime,
				endTime: shift.endTime,
				color: shift.color,
				abbreviation: shift.color === "green" ? "T" : "X",
				description: shift.color === "green" ? "Turno" : "Descanso",
				mode: "proyeccion",
				type: shift.color === "green" ? "shift" : "rest",
				active: true,
				keep: true,
			}));
		createAndUpdate(create, update, shifts).then((res) => {
			if (res) {
				setSelectedSequence(undefined);
			}
		});
	};

	return (
		<div className="flex z-10 relative pt-4 m-2">
			<label className="absolute -top-2 flex items-center bg-gray-50 px-1 text-sm font-medium text-gray-900 uppercase gap-2">
				<IdentificationIcon
					className="w-5 h-5 text-sky-500 hover:text-sky-600 cursor-pointer"
					onClick={() => setOpenInfo(true)}
				/>
				<CalendarDaysIcon
					className="w-5 h-5 text-sky-500 hover:text-sky-600 cursor-pointer"
					onClick={() => setOpenCalendar(true)}
				/>
				<BoltIcon
					className="w-5 h-5 text-sky-500 hover:text-sky-600 cursor-pointer"
					onClick={() => setOpenSequence(true)}
				/>
				{worker.name} - {worker.identification}
			</label>
			<div className="bg-gray-50 absolute -top-2 right-0 flex">
				<XMarkIcon
					className="w-5 h-5 hover:text-rose-400 cursor-pointer"
					onClick={() =>
						toast("Confirmar eliminacion", {
							action: {
								label: "Eliminar",
								onClick: () => removeWorker(stallId, worker.id, stalls),
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
				title="Calendario"
				btnText="Actualizar"
				action={selectedDays.length > 0 ? handleCreateAndUpdate : undefined}
			>
				<Calendar
					monthDays={monthDays}
					selectedDays={selectedDays}
					setSelectedDays={setSelectedDays}
				/>
				<form className="grid grid-cols-2 gap-2">
					<SelectHours
						times={times}
						setTimes={setTimes}
						isShift={isShift}
						setIsShift={setIsShift}
					/>
				</form>
			</CenteredModal>
			<CenteredModal
				open={openSequence}
				setOpen={setOpenSequence}
				icon={BoltIcon}
				title="Secuencias"
				btnText="Actualizar"
				action={selectedSequence ? () => handleSequence() : undefined}
			>
				<form className="grid grid-cols-2 gap-2">
					<SelectSequence
						selectedSequence={selectedSequence}
						setSelectedSequence={setSelectedSequence}
						selectedIndex={selectedIndex}
						setSelectedIndex={setSelectedIndex}
					/>
				</form>
			</CenteredModal>
			<CenteredModal
				open={openInfo}
				setOpen={setOpenInfo}
				icon={IdentificationIcon}
				title="Información de la persona"
			>
				<Info
					worker={worker}
					shifts={shifts.filter((s) => s.worker === worker.id)}
				/>
			</CenteredModal>
		</div>
	);
}
