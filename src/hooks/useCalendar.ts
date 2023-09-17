import { Profile } from "../services/auth/types";
import { CustomerWithId } from "../services/customers/types";
import { ShiftWithId } from "../services/shifts/types";
import { StallWithId } from "../services/stalls/types";
import { useCustomers } from "./useCustomers";
import { useStalls } from "./useStalls";
// import { useAppDispatch } from "./store";
import { useEffect, useState } from "react";

export function useCalendar(
	customers: CustomerWithId[],
	profile: Profile,
	stalls: StallWithId[],
	shifts: ShiftWithId[],
) {
	// const dispatch = useAppDispatch();
	const { getCustomers } = useCustomers(customers);
	const { getStallsByCustomer } = useStalls(stalls, shifts);
	const month = new Date().getMonth().toString();
	const year = new Date().getFullYear().toString();
	const [selectedMonth, setSelectedMonth] = useState<string>(month);
	const [selectedYear, setSelectedYear] = useState<string>(year);
	const [selectedCustomer, setSelectedCustomer] = useState<string>("");
	const actualCustomer = customers.find(
		(customer) => customer.id === selectedCustomer,
	);
	useEffect(() => {
		profile.company.id && getCustomers();
	}, [profile]);
	useEffect(() => {
		customers.length > 0 && setSelectedCustomer(customers[0].id);
	}, [customers]);
	useEffect(() => {
		selectedCustomer &&
			getStallsByCustomer([selectedMonth], [selectedYear], selectedCustomer);
	}, [selectedCustomer, selectedMonth, selectedYear]);

	return {
		actualCustomer,
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
		selectedCustomer,
		setSelectedCustomer,
	};
}
