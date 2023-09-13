import {
	CalendarDaysIcon,
	IdentificationIcon,
} from "@heroicons/react/24/solid";
import { Card, Grid, Select, SelectItem } from "@tremor/react";
import { useState } from "react";
import Loading from "../../common/Loading";
import { useAppSelector } from "../../hooks/store";
import { useTracing } from "../../hooks/useTracing";
import classNames from "../../utils/classNames";
import { months, years } from "../../utils/dates";
import Customer from "./Customer";
import WorkerList from "./WorkerList";

const sections = [
	{ title: "Listado Programaciones", icon: CalendarDaysIcon },
	{ title: "Listado Personal", icon: IdentificationIcon },
];
export default function Tracing() {
	const { profile } = useAppSelector((state) => state.auth);
	const { customers } = useAppSelector((state) => state.customers);
	const { stalls, loading } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const tracingData = useTracing(profile, customers, stalls, shifts);
	const [section, setSection] = useState(sections[0].title);

	return (
		<Grid numItems={1} className="gap-2 h-full p-2 pt-4">
			<Card className="p-1 overflow-y-auto bg-gray-50">
				<header className="flex justify-end items-center gap-2 border rounded-md p-1 sticky top-0 bg-gray-50 z-10">
					<div className="flex absolute left-2 text-lg">
						<Select
							icon={
								section === sections[0].title
									? sections[0].icon
									: sections[1].icon
							}
							className="w-60"
							value={section}
							onValueChange={(value) => setSection(value)}
						>
							{sections.map((section) => (
								<SelectItem
									key={`section-${section.title}`}
									value={section.title}
								>
									{section.title}
								</SelectItem>
							))}
						</Select>
					</div>
					<div className="flex gap-2">
						<Select
							value={tracingData.selectedMonth}
							onValueChange={(value) => tracingData.setSelectedMonth(value)}
						>
							{months.map((month) => (
								<SelectItem key={`month-${month.value}`} value={month.value}>
									{month.name}
								</SelectItem>
							))}
						</Select>
						<Select
							value={tracingData.selectedYear}
							onValueChange={(value) => tracingData.setSelectedYear(value)}
						>
							{years.map((year) => (
								<SelectItem key={`year-${year}`} value={year.value}>
									{year.name}
								</SelectItem>
							))}
						</Select>
					</div>
				</header>
				<main
					className={classNames(
						sections[0].title === section ? "grid grid-cols-4 gap-2" : "",
						"mt-2",
					)}
				>
					{sections[0].title === section &&
						customers.map((customer) => (
							<Customer
								key={customer.id}
								customer={customer}
								tracingData={tracingData}
							/>
						))}
					{sections[1].title === section && (
						<WorkerList groupedShifts={tracingData.groupedShifts} />
					)}
				</main>
			</Card>
			<Loading show={loading.state} text={loading.message} />
		</Grid>
	);
}
