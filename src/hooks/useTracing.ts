import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Profile } from "../services/auth/types";
import { CustomerWithId } from "../services/customers/types";
import { ShiftWithId } from "../services/shifts/types";
import { StallWithId } from "../services/stalls/types";
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

	return {
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
	};
}

export interface TracingData {
	selectedMonth: string;
	setSelectedMonth: Dispatch<SetStateAction<string>>;
	selectedYear: string;
	setSelectedYear: Dispatch<SetStateAction<string>>;
}
