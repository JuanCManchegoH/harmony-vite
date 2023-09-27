import axios from "axios";
import { differenceInDays, isAfter } from "date-fns";
import Cookie from "js-cookie";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { Profile } from "../services/auth/types";
import { Convention } from "../services/company/types";
import { CustomerWithId } from "../services/customers/types";
import { CreateShift, ShiftWithId } from "../services/shifts/types";
import { StallWithId } from "../services/stalls/types";
import { WorkerWithId } from "../services/workers/types";
import { calendarColors } from "../utils/colors";
import { DateToSring, MonthDay, getDays } from "../utils/dates";
import { getHour } from "../utils/hours";
import { useCustomers } from "./useCustomers";
import { HandleShiftsData, useShifts } from "./useShifts";
import { useStalls } from "./useStalls";

export function useCalendar(
	customers: CustomerWithId[],
	profile: Profile,
	stalls: StallWithId[],
	shifts: ShiftWithId[],
) {
	const { getCustomers } = useCustomers(customers);
	const { getStallsByCustomer } = useStalls(stalls, shifts);
	const { getEvents } = useShifts(shifts, stalls);
	const month = new Date().getMonth().toString();
	const year = new Date().getFullYear().toString();
	const [selectedMonth, setSelectedMonth] = useState<string>(month);
	const [selectedYear, setSelectedYear] = useState<string>(year);
	const [selectedCustomer, setSelectedCustomer] = useState<string>("");
	const [selectedBranch, setSelectedBranch] = useState<string>("");
	const [selectedStall, setSelectedStall] = useState<string>("");
	const [selectedWorker, setSelectedWorker] = useState<string>("");
	const [selectedDay, setSelectedDay] = useState<string>("01");
	const actualCustomer = customers.find(
		(customer) => customer.id === selectedCustomer,
	);
	const actualStall = stalls.find((stall) => stall.id === selectedStall);
	const [view, setView] = useState<"stalls" | "events">("stalls");
	useEffect(() => {
		profile.company.id && getCustomers();
	}, [profile.company.id]);
	useEffect(() => {
		customers.length > 0 && setSelectedCustomer(customers[0].id);
	}, [customers]);
	useEffect(() => {
		stalls.length > 0 &&
			setSelectedStall(
				stalls.find((stall) => stall.branch === selectedBranch)?.id || "",
			);
	}, [selectedBranch]);

	useEffect(() => {
		const types = ["shift", "rest", "event", "customer"];
		selectedCustomer &&
			getStallsByCustomer(
				[selectedMonth],
				[selectedYear],
				selectedCustomer,
				types,
			);
	}, [selectedCustomer, selectedMonth, selectedYear]);
	useEffect(() => {
		const types = ["event", "customer"];
		view === "events" && getEvents([selectedMonth], [selectedYear], types);
	}, [selectedMonth, selectedYear, view]);

	return {
		view,
		setView,
		actualCustomer,
		actualStall,
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
		selectedCustomer,
		setSelectedCustomer,
		selectedBranch,
		setSelectedBranch,
		selectedStall,
		setSelectedStall,
		selectedWorker,
		setSelectedWorker,
		selectedDay,
		setSelectedDay,
	};
}

export function useCreateEvent(
	setSelectedEventTab: Dispatch<SetStateAction<number>>,
	actualCustomer: CustomerWithId | undefined,
	stalls: StallWithId[],
	selectedMonth: string,
	selectedYear: string,
	shifts: ShiftWithId[],
) {
	const { createAndUpdate } = useShifts(shifts, stalls);
	// FirstStep
	const list = [...stalls, actualCustomer];
	const [selectedStall, setSelectedStall] = useState(list[0]);
	const [selectedWorker, setSelectedWorker] = useState<
		WorkerWithId | undefined
	>(undefined);
	const [selectedSequence, setSelectedSequence] = useState<string>("");
	const [position, setPosition] = useState<string>("");

	// SecondStep
	const [selectedConvention, setSelectedConvention] = useState<
		Convention | undefined
	>(undefined);
	const monthDays = getDays(selectedMonth, selectedYear);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [shiftsData, setShiftsData] = useState<HandleShiftsData>({
		selectedStartHour: "6",
		selectedStartMinute: "0",
		selectedEndHour: "18",
		selectedEndMinute: "0",
		selectedColor: calendarColors[0],
		description: "",
	});

	const handleCreateEvent = () => {
		if (selectedDays.length === 0)
			return toast.message("Datos incompletos", {
				description: "Seleccione al menos un día",
			});
		if (
			!selectedStall ||
			!shiftsData.description ||
			!selectedWorker ||
			!position
		) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		const data: CreateShift = {
			day: "",
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
			abbreviation: selectedConvention?.abbreviation || "",
			description: shiftsData.description,
			position,
			sequence: selectedSequence,
			type: selectedStall?.id === actualCustomer?.id ? "customer" : "event",
			active: true,
			keep: selectedConvention ? selectedConvention.keep : true,
			worker: selectedWorker?.id || "",
			workerName: selectedWorker?.name || "",
			stall: selectedStall?.id || "",
			stallName: selectedStall?.name || "",
			customer: actualCustomer?.id || "",
			customerName: actualCustomer?.name || "",
			month: selectedMonth,
			year: selectedYear,
		};
		const resetForm = () => {
			setSelectedWorker(undefined);
			setSelectedSequence("");
			setPosition("");
			setSelectedConvention(undefined);
			setSelectedDays([]);
			setShiftsData({
				selectedStartHour: "6",
				selectedStartMinute: "0",
				selectedEndHour: "18",
				selectedEndMinute: "0",
				selectedColor: calendarColors[0],
				description: "",
			});
		};
		const create = selectedDays.map((day) => {
			return {
				...data,
				day,
			};
		});
		createAndUpdate(create, [], undefined, undefined, undefined, () => {
			resetForm();
			setSelectedEventTab(0);
		});
	};

	return {
		list,
		selectedStall,
		setSelectedStall,
		selectedWorker,
		setSelectedWorker,
		position,
		setPosition,
		selectedSequence,
		setSelectedSequence,
		selectedConvention,
		setSelectedConvention,
		monthDays,
		selectedDays,
		setSelectedDays,
		shiftsData,
		setShiftsData,
		handleCreateEvent,
	};
}

export const useHandleEvents = () => {
	const [selectedDelete, setSelectedDelete] = useState<string[]>([]);

	const handleDeleteEvents = (
		deleteMany: (
			shiftsIds: string[],
			stallId: string,
		) => Promise<void | undefined>,
		stallId: string,
	) => {
		if (selectedDelete.length === 0) {
			return toast.message("Datos incompletos", {
				description: "Seleccione al menos un dia",
			});
		}
		deleteMany(selectedDelete, stallId).then(() => {
			setSelectedDelete([]);
		});
	};

	return {
		handleDeleteEvents,
		selectedDelete,
		setSelectedDelete,
	};
};

export const usePropose = (stalls: StallWithId[], events: ShiftWithId[]) => {
	const [selectedStalls, setSelectedStalls] = useState<StallWithId[]>([]);
	const defMonth = new Date().getMonth().toString();
	const defYear = new Date().getFullYear().toString();
	const { month, year } = stalls[0] || { month: defMonth, year: defYear };
	const [targetMonth, setTargetMonth] = useState<string>(
		(Number(month) + 1).toString(),
	);
	const [targetYear, setTargetYear] = useState<string>(
		Number(month) === 11 ? (Number(year) + 1).toString() : year,
	);
	const targetMonthDays = getDays(targetMonth, targetYear);
	const actualMonthDays = getDays(month, year);

	useEffect(() => {
		setSelectedStalls(stalls);
		setTargetMonth((Number(month) + 1).toString());
		setTargetYear(Number(month) === 11 ? (Number(year) + 1).toString() : year);
	}, [stalls]);

	const access_token = Cookie.get("access_token");
	axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

	async function handlePropose() {
		const isSame = targetMonth === month && targetYear === year;
		if (isAfter(actualMonthDays[0].date, targetMonthDays[0].date)) {
			return toast.message("Datos incorrectos", {
				description: "El mes de destino no puede ser anterior al actual",
			});
		}
		if (isSame) {
			return toast.message("Datos incorrectos", {
				description: "El mes de destino no puede ser el mismo que el actual",
			});
		}

		for (let i = 0; i < selectedStalls.length; i++) {
			const shiftsToPropose: CreateShift[] = [];
			const stall = selectedStalls[i];
			const { workers } = stall;
			const daysBetween = differenceInDays(
				targetMonthDays[0].date,
				actualMonthDays[0].date,
			);

			const newWorkers = workers
				.filter(
					(worker) =>
						!events.some(
							(event) =>
								event.worker === worker.id &&
								event.keep === false &&
								event.stall === stall.id,
						),
				)
				.map((worker) => {
					const { sequence, index, jump } = worker;
					const newJump = 0;
					const newIndex = (index + daysBetween - jump - 1) % sequence.length;
					const newWorkerData = {
						...worker,
						index: newIndex,
						jump: newJump,
					};
					return newWorkerData;
				});

			const newStallData = {
				...stall,
				workers: newWorkers,
				month: targetMonth,
				year: targetYear,
			};

			newWorkers.forEach((worker) => {
				if (worker.sequence.length === 0) return;
				const { sequence, index } = worker;
				const shifts = targetMonthDays.map((day, i) => {
					const step = sequence[(index + i) % sequence.length];
					return {
						worker: worker.id,
						workerName: worker.name,
						stall: "",
						stallName: stall.name,
						customer: stall.customer,
						customerName: stall.customerName,
						type: step.color === "green" ? "shift" : "rest",
						abbreviation: step.color === "green" ? "T" : "X",
						description: step.color === "green" ? "Turno" : "Descanso",
						active: true,
						keep: true,
						position: "",
						sequence: "",
						day: DateToSring(day.date),
						startTime: step.startTime || "",
						endTime: step.endTime || "",
						color: step.color || "gray",
						month: targetMonth,
						year: targetYear,
					};
				});
				shiftsToPropose.push(...shifts);
			});

			async function createSequence(shifts: CreateShift[]) {
				if (shifts.length > 0) {
					const createShiftPromise = axios.post<ShiftWithId[]>(
						api.shifts.createMany,
						{ shifts: shifts },
					);
					await toast.promise(createShiftPromise, {
						loading: `Creando turnos del puesto ${i + 1} de ${
							selectedStalls.length
						}}`,
						success: () => {
							return "Turnos y descansos creados";
						},
						error: "Error creando turnos",
					});
				}
			}

			const createStallPromise = axios.post<StallWithId>(
				api.stalls.create,
				newStallData,
			);
			try {
				toast.promise(createStallPromise, {
					loading: `Creando puesto ${i + 1} de ${selectedStalls.length}}`,
					success: ({ data }) => {
						shiftsToPropose.forEach((shift) => {
							shift.stall = data.id;
							shift.stallName = data.name;
						});
						createSequence(shiftsToPropose);
						return "Puesto creado";
					},
					error: "Error creando puesto",
				});
			} catch (error) {
				console.log(error);
			}
		}
	}
	return {
		selectedStalls,
		setSelectedStalls,
		targetMonth,
		setTargetMonth,
		targetYear,
		setTargetYear,
		handlePropose,
	};
};

export interface CreateEvent {
	list: (StallWithId | CustomerWithId | undefined)[];
	selectedStall: StallWithId | CustomerWithId | undefined;
	setSelectedStall: Dispatch<
		SetStateAction<StallWithId | CustomerWithId | undefined>
	>;
	selectedWorker: WorkerWithId | undefined;
	setSelectedWorker: Dispatch<SetStateAction<WorkerWithId | undefined>>;
	position: string;
	setPosition: Dispatch<SetStateAction<string>>;
	selectedSequence: string;
	setSelectedSequence: Dispatch<SetStateAction<string>>;
	selectedConvention: Convention | undefined;
	setSelectedConvention: Dispatch<SetStateAction<Convention | undefined>>;
	monthDays: MonthDay[];
	selectedDays: string[];
	setSelectedDays: Dispatch<SetStateAction<string[]>>;
	shiftsData: HandleShiftsData;
	setShiftsData: Dispatch<SetStateAction<HandleShiftsData>>;
	handleCreateEvent: Function;
}
