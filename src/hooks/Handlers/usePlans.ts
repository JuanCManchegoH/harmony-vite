import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Times } from "../../common/SelectHours";
import { WorkerData } from "../../components/Plans/Stalls/Stall";
import { Profile } from "../../services/auth/types";
import { Convention } from "../../services/company/types";
import { CustomerWithId } from "../../services/customers/types";
import { CreateShift, ShiftWithId } from "../../services/shifts/types";
import { StallWithId } from "../../services/stalls/types";
import { MonthDay, getDays } from "../../utils/dates";
import { getHour } from "../../utils/hours";
import { useCustomers } from "../useCustomers";
import { useShifts } from "../useShifts";
import { useStalls } from "../useStalls";

export function usePlans(
	customers: CustomerWithId[],
	profile: Profile,
	stalls: StallWithId[],
) {
	const { getCustomers } = useCustomers();
	const { getStallsByCustomer } = useStalls(stalls);
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
		selected &&
			getStallsByCustomer({
				months: [selectedMonth],
				years: [selectedYear],
				customerId: selected,
			});
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
	const { createAndUpdate } = useShifts();
	// FirstStep
	const list = [actualCustomer, ...stalls];
	const [selected, setSelected] = useState(list[0]);
	const [selectedWorker, setSelectedWorker] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [selectedSequence, setSelectedSequence] = useState<string>("");
	const [workerData, setWorkerData] = useState<WorkerData>({
		position: "",
		mode: "",
	});

	// SecondStep
	const [selectedConvention, setSelectedConvention] = useState<
		Convention | undefined
	>(undefined);
	const monthDays = getDays(selectedMonth, selectedYear);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [isShift, setIsShift] = useState<boolean>(true);
	const [times, setTimes] = useState<Times>({
		selectedStartHour: "6",
		selectedStartMinute: "0",
		selectedEndHour: "18",
		selectedEndMinute: "0",
	});

	const handleCreateEvent = () => {
		const data: CreateShift = {
			day: "",
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
			color: isShift ? selectedConvention?.color || "green" : "gray",
			abbreviation: isShift ? selectedConvention?.abbreviation || "T" : "X",
			description,
			mode: workerData.mode,
			position: workerData.position,
			sequence: selectedSequence,
			type: selected?.id === actualCustomer?.id ? "customerEvent" : "event",
			active: true,
			keep: selectedConvention?.keep || true,
			worker: selectedWorker || "",
			stall: selected?.id || "",
		};
		const create = selectedDays.map((day) => {
			return {
				...data,
				day,
			};
		});
		const update: [] = [];
		createAndUpdate(create, update, shifts).then((res) => {
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
		workerData,
		setWorkerData,
		description,
		setDescription,
		selectedSequence,
		setSelectedSequence,
		selectedConvention,
		setSelectedConvention,
		monthDays,
		selectedDays,
		setSelectedDays,
		isShift,
		setIsShift,
		times,
		setTimes,
		handleCreateEvent,
	};
}

export interface CreateEvent {
	list: (CustomerWithId | StallWithId | undefined)[];
	selected: CustomerWithId | StallWithId | undefined;
	setSelected: Dispatch<
		SetStateAction<CustomerWithId | StallWithId | undefined>
	>;
	selectedWorker: string;
	setSelectedWorker: Dispatch<SetStateAction<string>>;
	workerData: WorkerData;
	description: string;
	setDescription: Dispatch<SetStateAction<string>>;
	selectedSequence: string;
	setSelectedSequence: Dispatch<SetStateAction<string>>;
	setWorkerData: Dispatch<SetStateAction<WorkerData>>;
	selectedConvention: Convention | undefined;
	setSelectedConvention: Dispatch<SetStateAction<Convention | undefined>>;
	monthDays: MonthDay[];
	selectedDays: string[];
	setSelectedDays: Dispatch<SetStateAction<string[]>>;
	isShift: boolean;
	setIsShift: Dispatch<SetStateAction<boolean>>;
	times: Times;
	setTimes: Dispatch<SetStateAction<Times>>;
	handleCreateEvent: Function;
}
