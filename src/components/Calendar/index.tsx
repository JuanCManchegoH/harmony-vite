import {
	ChevronRightIcon,
	FlagIcon,
	IdentificationIcon,
	MapPinIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Badge, Card, Grid, Icon, Select, SelectItem } from "@tremor/react";
import { useState } from "react";
import CustomToggle from "../../common/CustomToggle";
import { Dropdown, DropdownItem } from "../../common/DropDown";
import { useAppSelector } from "../../hooks/store";
import { useCalendar } from "../../hooks/useCalendar";
import { getDays, months, years } from "../../utils/dates";
import { validateRoles } from "../../utils/roles";
import Customers from "./Customers";
import StallCalendar from "./StallCalendar";
import Workers from "./Workers";

export default function Calendar() {
	const { profile } = useAppSelector((state) => state.auth);
	const { customers } = useAppSelector((state) => state.customers);
	const { stalls } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const plansData = useCalendar(customers, profile, stalls, shifts);

	const [view, setView] = useState<"stalls" | "events">("stalls");
	const [openCreateStall, setOpenCreateStall] = useState(false);
	const [openCreateEvent, setOpenCreateEvent] = useState(false);
	const [openCustomers, setOpenCustomers] = useState(false);
	const [openWorkers, setOpenWorkers] = useState(false);
	const monthDays = getDays("8", "2023");

	const options = [
		{
			icon: MapPinIcon,
			name: "Crear puesto",
			action: () => setOpenCreateStall(true),
			show: validateRoles(profile.roles, [], ["handle_stalls", "admin"]),
		},
		{
			icon: FlagIcon,
			name: "Crear evento",
			action: () => setOpenCreateEvent(true),
			show: validateRoles(
				profile.roles,
				[],
				["create_shifts", "handle_shifts", "admin"],
			),
		},
	];
	return (
		<Grid numItems={1} className="gap-2 h-full p-2 pt-4">
			<main className="flex gap-2">
				<Card className="bg-gray-50 p-2">
					<header className="flex justify-between">
						<div className="flex items-center gap-2">
							<CustomToggle
								enabled={view === "events"}
								setEnabled={(value) => setView(value ? "events" : "stalls")}
								values={{ enabled: FlagIcon, disabled: MapPinIcon }}
							/>
							{view === "stalls" && (
								<>
									<Badge color="sky" icon={UserGroupIcon}>
										Customer
									</Badge>
									<ChevronRightIcon className="w-4 h-4" />
									<Badge color="sky" icon={MapPinIcon}>
										Stall
									</Badge>
								</>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Select
								value={plansData.selectedMonth}
								onValueChange={(value) => plansData.setSelectedMonth(value)}
							>
								{months.map((month) => (
									<SelectItem key={`month-${month.value}`} value={month.value}>
										{month.name}
									</SelectItem>
								))}
							</Select>
							<Select
								value={plansData.selectedYear}
								onValueChange={(value) => plansData.setSelectedYear(value)}
							>
								{years.map((year) => (
									<SelectItem key={`year-${year}`} value={year.value}>
										{year.name}
									</SelectItem>
								))}
							</Select>
							{view === "stalls" && (
								<>
									<Dropdown btnText="Opciones">
										{options
											.filter((option) => option.show)
											.map((option) => (
												<DropdownItem
													key={option.name}
													icon={option.icon}
													onClick={option.action}
												>
													{option.name}
												</DropdownItem>
											))}
									</Dropdown>
									<Icon
										icon={UserGroupIcon}
										color="gray"
										size="md"
										className="cursor-pointer"
										variant="solid"
										onClick={() => setOpenCustomers(!openCustomers)}
									/>
									<Icon
										icon={IdentificationIcon}
										color="gray"
										size="md"
										className="cursor-pointer"
										variant="solid"
										onClick={() => setOpenWorkers(!openWorkers)}
									/>
								</>
							)}
						</div>
					</header>
					{view === "stalls" && <StallCalendar monthDays={monthDays} />}
				</Card>
				<Card className="max-w-xl bg-gray-50">Aside</Card>
			</main>
			<Customers
				open={openCustomers}
				setOpen={setOpenCustomers}
				selected={plansData.selectedCustomer}
				setSelected={plansData.setSelectedCustomer}
			/>
			<Workers open={openWorkers} setOpen={setOpenWorkers} />
		</Grid>
	);
}
