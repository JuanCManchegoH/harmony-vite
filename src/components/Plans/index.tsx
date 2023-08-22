import {
	ForwardIcon,
	IdentificationIcon,
	MapPinIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Button, Card, Grid, Select, SelectItem } from "@tremor/react";
import { useEffect, useState } from "react";
import Background from "../../common/Background";
import { Dropdown, DropdownItem } from "../../common/DropDown";
import { useAppSelector } from "../../hooks/store";
import { useCustomers } from "../../hooks/useCustomers";
import { months, years } from "../../utils/dates";
import Customers from "./Customers";
import Workers from "./Workers";

export default function Plans() {
	const customers = useAppSelector((state) => state.customers.customers);
	const profile = useAppSelector((state) => state.auth.profile);
	const { getCustomers } = useCustomers();
	const [openCustomers, setOpenCustomers] = useState(false);
	const [openWorkers, setOpenWorkers] = useState(false);
	const [selected, setSelected] = useState<string>("");
	const month = new Date().getMonth().toString();
	const year = new Date().getFullYear().toString();
	const [selectedMonth, setSelectedMonth] = useState<string>(month);
	const [selectedYear, setSelectedYear] = useState<string>(year);
	useEffect(() => {
		profile.company.id && getCustomers();
	}, [profile]);
	useEffect(() => {
		profile.company.id && setSelected(customers[0]?.id || "");
	}, [customers]);

	const options = [
		{ icon: MapPinIcon, name: "Crear puesto", action: () => {} },
		{ icon: ForwardIcon, name: "Sugerir próximo mes", action: () => {} },
	];

	return (
		<Grid numItems={1} className="gap-2 h-full p-2">
			<section className="">
				<Card className="p-1 flex justify-end gap-2 relative">
					<div className="absolute left-1">
						<Dropdown btnText="Opciones">
							{options.map((option) => (
								<DropdownItem icon={option.icon} onClick={option.action}>
									{option.name}
								</DropdownItem>
							))}
						</Dropdown>
					</div>
					<div className="flex gap-2">
						<Select
							value={selectedMonth}
							onValueChange={(value) => setSelectedMonth(value)}
						>
							{months.map((month) => (
								<SelectItem key={`month-${month.value}`} value={month.value}>
									{month.name}
								</SelectItem>
							))}
						</Select>
						<Select
							value={selectedYear}
							onValueChange={(value) => setSelectedYear(value)}
						>
							{years.map((year) => (
								<SelectItem key={`year-${year}`} value={year.value}>
									{year.name}
								</SelectItem>
							))}
						</Select>
					</div>
					<Button
						color="sky"
						size="xs"
						onClick={() => setOpenCustomers(!openCustomers)}
					>
						<UserGroupIcon className="h-5 w-5" />
					</Button>
					<Button
						color="sky"
						size="xs"
						onClick={() => setOpenWorkers(!openWorkers)}
					>
						<IdentificationIcon className="h-5 w-5" />
					</Button>
				</Card>
			</section>
			<Customers
				open={openCustomers}
				setOpen={setOpenCustomers}
				selected={selected}
				setSelected={setSelected}
			/>
			<Workers open={openWorkers} setOpen={setOpenWorkers} />
			<Background />
		</Grid>
	);
}
