import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { Convention, Sequence } from "../services/company/types";
import { setLoading, setShifts } from "../services/shifts/slice";
import {
	AppliedSequence,
	CreateShift,
	ShiftWithId,
	UpdateShift,
} from "../services/shifts/types";
import { setStalls } from "../services/stalls/slice";
import { StallWithId, StallWorker } from "../services/stalls/types";
import { ColorGroup, calendarColors } from "../utils/colors";
import { DateToSring, MonthDay } from "../utils/dates";
import { getHour } from "../utils/hours";
import { useAppDispatch } from "./store";

interface Data {
	created: ShiftWithId[];
	updated: ShiftWithId[];
	stall?: StallWithId;
}

export const useShifts = (shifts: ShiftWithId[], stalls: StallWithId[]) => {
	const dispatch = useAppDispatch();

	async function createAndUpdate(
		create: CreateShift[],
		update: UpdateShift[],
		sequence?: AppliedSequence,
	) {
		dispatch(setLoading({ state: true, message: "Creando turnos" }));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const dto = sequence
				? {
						create,
						update,
						appliedSequence: sequence,
				  }
				: {
						create,
						update,
				  };
			const { data } = await axios.put<Data>(api.shifts.createAndUpdate, {
				...dto,
			});
			toast.success("Turnos creados");
			const updatedShifts = shifts.map((shift) => {
				const updatedShift = data.updated.find(
					(updatedShift) => updatedShift.id === shift.id,
				);
				if (updatedShift) return updatedShift;
				return shift;
			});
			dispatch(setShifts([...updatedShifts, ...data.created]));
			if (data.stall) {
				const updatedStalls = stalls.map((stall) => {
					if (stall.id === data.stall?.id) {
						return data.stall;
					}
					return stall;
				});
				dispatch(setStalls(updatedStalls));
			}
			return data;
		} catch {
			toast.error("Error Creando turnos");
		} finally {
			dispatch(setLoading({ state: false, message: "" }));
		}
	}

	async function deleteMany(shiftsIds: string[], stallId: string) {
		dispatch(setLoading({ state: true, message: "Eliminando turnos" }));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			await axios.post(api.shifts.deleteMany(stallId), {
				shifts: shiftsIds,
			});
			toast.success("Turnos eliminados");
			dispatch(
				setShifts(
					shifts.filter((shift) => !shiftsIds.includes(shift.id as string)),
				),
			);
		} catch {
			toast.error("Error eliminando turnos");
		} finally {
			dispatch(setLoading({ state: false, message: "" }));
		}
	}

	return {
		createAndUpdate,
		deleteMany,
	};
};

export const useHandleShifts = (
	shifts: ShiftWithId[],
	worker: StallWorker,
	stall: StallWithId,
	monthDays: MonthDay[],
) => {
	// Calendar data
	const [selectedConvention, setSelectedConvention] = useState<
		Convention | undefined
	>(undefined);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [shiftsData, setShiftsData] = useState<HandleShiftsData>({
		selectedStartHour: "6",
		selectedStartMinute: "0",
		selectedEndHour: "18",
		selectedEndMinute: "0",
		selectedColor: calendarColors[0],
		description: "",
	});
	// Sequence data
	const [selectedSequence, setSelectedSequence] = useState<Sequence>();
	const [selectedIndex, setSelectedIndex] = useState<number>(1);
	const [jump, setJump] = useState<number>(0);

	// Delete data
	const [selectedDelete, setSelectedDelete] = useState<string[]>([]);

	const handleCreateAndUpdate = (
		createAndUpdate: (
			create: CreateShift[],
			update: UpdateShift[],
			sequence?: AppliedSequence,
		) => Promise<Data | undefined>,
	) => {
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
				position: "",
				sequence: "",
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
		createAndUpdate(create, update).then((res) => {
			if (res) {
				setSelectedDays([]);
			}
		});
	};
	const handleSequence = (
		createAndUpdate: (
			create: CreateShift[],
			update: UpdateShift[],
			sequence?: AppliedSequence,
		) => Promise<Data | undefined>,
	) => {
		if (!selectedSequence) {
			return toast.message("Datos incompletos", {
				description: "Seleccione una secuencia",
			});
		}
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
				mode: "proyeccion",
				type: shift.color === "green" ? "shift" : "rest",
				active: true,
				keep: true,
			}));

		const sequence = {
			stall: stall.id,
			worker: worker.id,
			sequence: selectedSequence?.steps || [],
			index: selectedIndex,
			jump,
		};
		createAndUpdate(create, update, sequence).then((res) => {
			if (res) {
				setSelectedSequence(undefined);
				setJump(0);
			}
		});
	};

	const handleDeleteShifts = (
		deleteMany: (
			shiftsIds: string[],
			stallId: string,
		) => Promise<void | undefined>,
		stallId: string,
	) => {
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
		selectedConvention,
		setSelectedConvention,
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
