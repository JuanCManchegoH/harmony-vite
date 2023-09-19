import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { Convention, Sequence } from "../services/company/types";
import { setEvents } from "../services/events/slice";
import { setShifts } from "../services/shifts/slice";
import {
	CreateShift,
	ShiftWithId,
	UpdateShift,
} from "../services/shifts/types";
import { setStalls } from "../services/stalls/slice";
import {
	StallWithId,
	StallWorker,
	UpdateStallWorker,
} from "../services/stalls/types";
import { ColorGroup, calendarColors } from "../utils/colors";
import { DateToSring, MonthDay } from "../utils/dates";
import { getHour } from "../utils/hours";
import { useAppDispatch } from "./store";

export const useShifts = (shifts: ShiftWithId[], stalls: StallWithId[]) => {
	const dispatch = useAppDispatch();

	async function createAndUpdate(
		create: CreateShift[],
		update: UpdateShift[],
		updateWorker?: UpdateStallWorker,
		stallId?: string,
		workerId?: string,
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const createShiftsPromise =
				create.length > 0
					? axios.post<ShiftWithId[]>(api.shifts.createMany, { shifts: create })
					: Promise.resolve({ data: [] });
			const updateShiftsPromise =
				update.length > 0
					? axios.put<ShiftWithId[]>(api.shifts.updateMany, { shifts: update })
					: Promise.resolve({ data: [] });

			const updateWorkerPromise =
				updateWorker && stallId && workerId
					? axios.put<StallWorker>(
							api.stalls.updateWorker(stallId, workerId),
							updateWorker,
					  )
					: Promise.resolve({ data: {} as StallWorker });
			await toast.promise(
				Promise.all([
					createShiftsPromise,
					updateShiftsPromise,
					updateWorkerPromise,
				]),
				{
					loading: "Creando y/o actualizando turnos",
					success: (data) => {
						const [createShifts, updateShifts, updatedWorkerPromise] = data;
						const updatedShifts = shifts.map((shift) => {
							const updatedShift = updateShifts.data.find(
								(updatedShift) => updatedShift.id === shift.id,
							);
							return updatedShift || shift;
						});
						const updatedStall = updatedWorkerPromise.data;
						dispatch(setShifts([...updatedShifts, ...createShifts.data]));
						dispatch(
							setStalls(
								stalls.map((stall) =>
									stall.id === stallId ? updatedStall : stall,
								),
							),
						);
						onSuccess?.();
						return "Turnos creados y/o actualizados";
					},
					error: "Error creando y/o actualizando turnos",
				},
			);
		} catch (error) {
			console.log(error);
		}
	}

	async function getEvents(
		months: string[],
		years: string[],
		types: string[],
		onSucces?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const getEventsPromise = axios.post<ShiftWithId[]>(
				api.shifts.getByMonthsAndYears,
				{ months, years, types },
			);
			await toast.promise(getEventsPromise, {
				loading: "Cargando eventos",
				success: ({ data }) => {
					dispatch(setEvents(data));
					onSucces?.();
					return "Eventos cargados";
				},
				error: "Error cargando eventos",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteMany(
		shiftsIds: string[],
		stallId: string,
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const deleteShiftsPromise = axios.post<ShiftWithId[]>(
				api.shifts.deleteMany(stallId),
				{ shifts: shiftsIds },
			);
			await toast.promise(deleteShiftsPromise, {
				loading: "Eliminando turnos",
				success: () => {
					dispatch(
						setShifts(
							shifts.filter((shift) => !shiftsIds.includes(shift.id as string)),
						),
					);
					onSuccess?.();
					return "Turnos eliminados";
				},
				error: "Error eliminando turnos",
			});
		} catch (error) {
			console.log(error);
		}
	}

	return {
		createAndUpdate,
		getEvents,
		deleteMany,
	};
};

export const useHandleCreateAndUpdate = (
	stalls: StallWithId[],
	shifts: ShiftWithId[],
	worker: StallWorker,
	stall: StallWithId,
	month: string,
	year: string,
) => {
	const { createAndUpdate } = useShifts(shifts, stalls);
	const [selectedConvention, setSelectedConvention] = useState<
		Convention | undefined
	>(undefined);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [shiftsData, setShiftsData] = useState({
		selectedStartHour: "6",
		selectedStartMinute: "0",
		selectedEndHour: "18",
		selectedEndMinute: "0",
		selectedColor: calendarColors[0],
		description: "",
	});

	const handleCreateAndUpdate = () => {
		if (selectedDays.length === 0) {
			return toast.message("Datos incompletos", {
				description: "Seleccione al menos un día",
			});
		}
		const commonData = {
			startTime:
				shiftsData.selectedColor.name !== "Descanso"
					? `${getHour(shiftsData.selectedStartHour)}:${getHour(
							shiftsData.selectedStartMinute,
					  )}`
					: "00:00",
			endTime:
				shiftsData.selectedColor.name !== "Descanso"
					? `${getHour(shiftsData.selectedEndHour)}:${getHour(
							shiftsData.selectedEndMinute,
					  )}`
					: "00:00",
			color: shiftsData.selectedColor.color,
			abbreviation: shiftsData.selectedColor.abbreviation,
			description: shiftsData.selectedColor.description
				? shiftsData.selectedColor.description
				: shiftsData.description,
			type: shiftsData.selectedColor.type,
			active: true,
			keep: selectedConvention?.keep || true,
		};
		const create = selectedDays
			.filter(
				(day) =>
					!shifts.find(
						(shift) =>
							shift.day === day &&
							shift.worker === worker.id &&
							shift.stall === stall.id,
					),
			)
			.map((day) => ({
				day,
				...commonData,
				worker: worker.id,
				workerName: worker.name,
				stall: stall.id,
				stallName: stall.name,
				customer: stall.customer,
				customerName: stall.customerName,
				position: "",
				sequence: "",
				month,
				year,
			}));
		const update = selectedDays
			.filter((day) =>
				shifts.find(
					(shift) =>
						shift.day === day &&
						shift.worker === worker.id &&
						shift.stall === stall.id,
				),
			)
			.map((day) => ({
				id: shifts.find(
					(shift) =>
						shift.day === day &&
						shift.worker === worker.id &&
						shift.stall === stall.id,
				)?.id as string,
				...commonData,
			}));
		createAndUpdate(create, update, undefined, undefined, undefined, () =>
			setSelectedDays([]),
		);
	};
	return {
		shiftsData,
		setShiftsData,
		selectedDays,
		setSelectedDays,
		handleCreateAndUpdate,
		selectedConvention,
		setSelectedConvention,
	};
};

export const useHandleSequence = (
	stalls: StallWithId[],
	shifts: ShiftWithId[],
	worker: StallWorker,
	stall: StallWithId,
	monthDays: MonthDay[],
	month: string,
	year: string,
) => {
	const { createAndUpdate } = useShifts(shifts, stalls);
	const [selectedConvention, setSelectedConvention] = useState<
		Convention | undefined
	>(undefined);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [shiftsData, setShiftsData] = useState({
		selectedStartHour: "6",
		selectedStartMinute: "0",
		selectedEndHour: "18",
		selectedEndMinute: "0",
		selectedColor: calendarColors[0],
		description: "",
	});

	const [selectedSequence, setSelectedSequence] = useState<Sequence>();
	const [selectedIndex, setSelectedIndex] = useState<number>(1);
	const [jump, setJump] = useState<number>(0);

	const handleSequence = () => {
		const monthDaysToUse = monthDays.slice(jump);
		const sequenceShifts = monthDaysToUse.map((day, i) => {
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
							s.stall === stall.id,
					),
			)
			.map((shift) => ({
				...shift,
				worker: worker.id,
				workerName: worker.name,
				stall: stall.id,
				stallName: stall.name,
				customer: stall.customer,
				customerName: stall.customerName,
				type: shift.color === "green" ? "shift" : "rest",
				abbreviation: shift.color === "green" ? "T" : "X",
				description: shift.color === "green" ? "Turno" : "Descanso",
				active: true,
				keep: true,
				position: "",
				sequence: "",
				month,
				year,
			}));

		const update = sequenceShifts
			.filter((shift) =>
				shifts.find(
					(s) =>
						s.day === shift.day &&
						s.worker === worker.id &&
						s.stall === stall.id,
				),
			)
			.map((shift) => ({
				id: shifts.find(
					(s) =>
						s.day === shift.day &&
						s.worker === worker.id &&
						s.stall === stall.id,
				)?.id as string,
				startTime: shift.startTime,
				endTime: shift.endTime,
				color: shift.color,
				abbreviation: shift.color === "green" ? "T" : "X",
				description: shift.color === "green" ? "Turno" : "Descanso",
				type: shift.color === "green" ? "shift" : "rest",
				active: true,
				keep: true,
			}));

		const updateWorker = {
			sequence: selectedSequence?.steps || [],
			index: selectedIndex,
			jump,
		};

		createAndUpdate(create, update, updateWorker, stall.id, worker.id, () => {
			setSelectedSequence(undefined);
			setJump(0);
		});
	};

	return {
		shiftsData,
		setShiftsData,
		selectedDays,
		setSelectedDays,
		handleSequence,
		selectedConvention,
		setSelectedConvention,
		selectedSequence,
		setSelectedSequence,
		selectedIndex,
		setSelectedIndex,
		jump,
		setJump,
	};
};

export const useHandleDeleteShifts = (
	stalls: StallWithId[],
	shifts: ShiftWithId[],
) => {
	const { deleteMany } = useShifts(shifts, stalls);
	const [selectedDelete, setSelectedDelete] = useState<string[]>([]);
	const handleDeleteShifts = (stallId: string) => {
		if (selectedDelete.length === 0) {
			return toast.message("Datos incompletos", {
				description: "Seleccione al menos un turno",
			});
		}
		deleteMany(selectedDelete, stallId).then(() => {
			setSelectedDelete([]);
		});
	};
	return {
		selectedDelete,
		setSelectedDelete,
		handleDeleteShifts,
	};
};

export interface HandleShiftsData {
	selectedStartHour: string;
	selectedStartMinute: string;
	selectedEndHour: string;
	selectedEndMinute: string;
	selectedColor: ColorGroup;
	description: string;
}
