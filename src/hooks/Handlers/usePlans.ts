import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { Profile } from "../../services/auth/types";
import { Convention } from "../../services/company/types";
import { CustomerWithId } from "../../services/customers/types";
import { CreateShift, ShiftWithId } from "../../services/shifts/types";
import { StallWithId } from "../../services/stalls/types";
import { WorkerWithId } from "../../services/workers/types";
import { MonthDay, getDays } from "../../utils/dates";
import { getHour } from "../../utils/hours";
import { useCustomers } from "../useCustomers";
import { HandleShiftsData, useShifts } from "../useShifts";
import { useStalls } from "../useStalls";

export function usePlans(
	customers: CustomerWithId[],
	profile: Profile,
	stalls: StallWithId[],
	shits: ShiftWithId[],
) {
	const { getCustomers } = useCustomers(customers);
	const { getStallsByCustomer } = useStalls(stalls, shits);
	const month = new Date().getMonth().toString();
	const year = new Date().getFullYear().toString();
	const [selectedMonth, setSelectedMonth] = useState<string>(month);
	const [selectedYear, setSelectedYear] = useState<string>(year);
	const [selected, setSelected] = useState<string>("");
	const actualCustomer = customers.find((customer) => customer.id === selected);
	useEffect(() => {
		profile.company.id && getCustomers();
	}, [profile]);
	useEffect(() => {
		selected && getStallsByCustomer([selectedMonth], [selectedYear], selected);
	}, [selected, selectedMonth, selectedYear]);

	return {
		actualCustomer,
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
		selected,
		setSelected,
	};
}

export interface PlansData {
	actualCustomer: CustomerWithId | undefined;
	selectedMonth: string;
	setSelectedMonth: Dispatch<SetStateAction<string>>;
	selectedYear: string;
	setSelectedYear: Dispatch<SetStateAction<string>>;
	selected: string;
	setSelected: Dispatch<SetStateAction<string>>;
}

export function useCreateEvent(
	actualCustomer: CustomerWithId | undefined,
	stalls: StallWithId[],
	selectedMonth: string,
	selectedYear: string,
	shifts: ShiftWithId[],
) {
	const { createAndUpdate } = useShifts(shifts, stalls);
	// FirstStep
	const list = [actualCustomer, ...stalls];
	const [selected, setSelected] = useState(list[0]);
	const [selectedWorker, setSelectedWorker] = useState<
		WorkerWithId | undefined
	>(undefined);
	const [description, setDescription] = useState<string>("");
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
		isShift: true,
	});

	const handleCreateEvent = () => {
		if (selectedDays.length === 0)
			return toast.message("Datos incompletos", {
				description: "Seleccione al menos un día",
			});
		if (!selected && !description && !selectedWorker && !position) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		if (!shiftsData.isShift) {
			if (!selectedConvention) return toast.error("Seleccione una convención");
		}
		const data: CreateShift = {
			day: "",
			startTime: shiftsData.isShift
				? `${getHour(shiftsData.selectedStartHour)}:${getHour(
						shiftsData.selectedStartMinute,
				  )}`
				: "00:00",
			endTime: shiftsData.isShift
				? `${getHour(shiftsData.selectedEndHour)}:${getHour(
						shiftsData.selectedEndMinute,
				  )}`
				: "00:00",
			color: shiftsData.isShift ? selectedConvention?.color || "green" : "gray",
			abbreviation: shiftsData.isShift
				? selectedConvention?.abbreviation || "T"
				: "X",
			description,
			position,
			sequence: selectedSequence,
			type: selected?.id === actualCustomer?.id ? "customer" : "event",
			active: true,
			keep: selectedConvention?.keep || true,
			worker: selectedWorker?.id || "",
			workerName: selectedWorker?.name || "",
			stall: selected?.id || "",
			stallName: selected?.name || "",
		};
		const create = selectedDays.map((day) => {
			return {
				...data,
				day,
			};
		});
		const update: [] = [];
		createAndUpdate(create, update).then((res) => {
			if (res) {
				setSelectedDays([]);
			}
		});
	};

	return {
		list,
		selected,
		setSelected,
		selectedWorker,
		setSelectedWorker,
		position,
		setPosition,
		description,
		setDescription,
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

export interface CreateEvent {
	list: (CustomerWithId | StallWithId | undefined)[];
	selected: CustomerWithId | StallWithId | undefined;
	setSelected: Dispatch<
		SetStateAction<CustomerWithId | StallWithId | undefined>
	>;
	selectedWorker: WorkerWithId | undefined;
	setSelectedWorker: Dispatch<SetStateAction<WorkerWithId | undefined>>;
	position: string;
	setPosition: Dispatch<SetStateAction<string>>;
	description: string;
	setDescription: Dispatch<SetStateAction<string>>;
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
