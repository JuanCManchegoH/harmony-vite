import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Profile } from "../services/auth/types";
import { CustomerWithId } from "../services/customers/types";
import { ShiftWithId } from "../services/shifts/types";
import { StallWithId } from "../services/stalls/types";
import { getDiference } from "../utils/hours";
import { useCustomers } from "./useCustomers";
import { useStalls } from "./useStalls";

export function useTracing(
	profile: Profile,
	customers: CustomerWithId[],
	stalls: StallWithId[],
	shifts: ShiftWithId[],
) {
	const { getCustomers } = useCustomers(customers);
	const { getStallsByCustomers } = useStalls(stalls, shifts);
	const month = new Date().getMonth().toString();
	const year = new Date().getFullYear().toString();
	const [selectedMonth, setSelectedMonth] = useState<string>(month);
	const [selectedYear, setSelectedYear] = useState<string>(year);

	useEffect(() => {
		profile.company.id && getCustomers();
	}, [profile]);

	useEffect(() => {
		getStallsByCustomers([selectedMonth], [selectedYear]);
	}, [selectedMonth, selectedYear]);

	const groupedShifts = shifts
		.reduce((groups, shift) => {
			const workerIndex = groups.findIndex(
				(group) =>
					group[0].worker === shift.worker &&
					group[0].abbreviation === shift.abbreviation &&
					group[0].stall === shift.stall &&
					group[0].description === shift.description &&
					getDiference(group[0].startTime, group[0].endTime).str ===
						getDiference(shift.startTime, shift.endTime).str &&
					group[0].position === shift.position &&
					group[0].sequence === shift.sequence &&
					group[0].type === shift.type,
			);
			if (workerIndex === -1) {
				groups.push([shift]);
			} else {
				groups[workerIndex].push(shift);
			}
			return groups;
		}, [] as ShiftWithId[][])
		.sort((a, b) => {
			if (a[0].worker > b[0].worker) return 1;
			if (a[0].worker < b[0].worker) return -1;

			return 0;
		});

	return {
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
		groupedShifts,
	};
}

export interface TracingData {
	selectedMonth: string;
	setSelectedMonth: Dispatch<SetStateAction<string>>;
	selectedYear: string;
	setSelectedYear: Dispatch<SetStateAction<string>>;
}
