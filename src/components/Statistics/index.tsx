import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import { Button, Card, Grid, Select, SelectItem } from "@tremor/react";
import { useAppSelector } from "../../hooks/store";
import useStatistics, {
	statisticsSecs,
	useCalendarExcel,
	useExcel,
	useResumeExcel,
} from "../../hooks/useStatistics";
import classNames from "../../utils/classNames";
import { getDays, months, years } from "../../utils/dates";
import Customer from "./Customer";
import WorkersList from "./WorkersList";

export default function Statistics({ tabIndex }: { tabIndex: number }) {
	const { positions, conventions, sequences } = useAppSelector(
		(state) => state.auth.profile.company,
	);
	const { customers } = useAppSelector((state) => state.customers);
	const { groupedShifts, stalls, shifts } = useAppSelector(
		(state) => state.statistics,
	);
	const statistics = useStatistics(groupedShifts, customers, stalls, tabIndex);
	const { generateExcel } = useExcel(
		positions,
		statistics.excelGroups,
		customers,
		stalls,
		statistics.selectedYear,
	);
	const monthDays = getDays(statistics.selectedMonth, statistics.selectedYear);
	const { generateCalendarExcel } = useCalendarExcel(
		customers.filter((customer) =>
			statistics.calendarFilters.selectedCCustomers.includes(customer.id),
		),
		stalls,
		shifts,
		monthDays,
	);

	const { generateResumeExcel } = useResumeExcel(
		conventions.slice().sort((a, b) => a.color.localeCompare(b.color)),
		sequences,
		customers.filter((customer) =>
			statistics.calendarFilters.selectedCCustomers.includes(customer.id),
		),
		stalls,
		shifts,
		monthDays,
	);

	return (
		<Grid numItems={1} className="gap-2 h-full p-2 pt-4">
			<Card className="p-1 overflow-y-auto bg-gray-50">
				<header className="flex justify-end items-center gap-2 border-b pb-1 sticky top-0 bg-gray-50 z-10">
					{statisticsSecs[0].title === statistics.section && (
						<>
							<Button
								variant="secondary"
								color="sky"
								size="sm"
								onClick={() => {
									if (
										statistics.calendarFilters.selectedCCustomers.length === 0
									) {
										statistics.calendarFilters.setSelectedCCustomers(
											customers.map((customer) => customer.id),
										);
									} else {
										statistics.calendarFilters.setSelectedCCustomers([]);
									}
								}}
								tooltip={
									statistics.calendarFilters.selectedCCustomers.length === 0
										? "Todos"
										: "Ninguno"
								}
							>
								{statistics.calendarFilters.selectedCCustomers.length === 0
									? "Todos"
									: "Ninguno"}
							</Button>

							<Button
								icon={ArrowDownCircleIcon}
								color="sky"
								size="sm"
								onClick={generateResumeExcel}
								tooltip="Descargar Reporte"
								disabled={
									statistics.calendarFilters.selectedCCustomers.length === 0
								}
							>
								Reporte
							</Button>
							<Button
								icon={ArrowDownCircleIcon}
								color="sky"
								size="sm"
								onClick={generateCalendarExcel}
								tooltip="Descargar Programaciones"
								disabled={
									statistics.calendarFilters.selectedCCustomers.length === 0
								}
							>
								Programaciones
							</Button>
						</>
					)}
					<div className="flex absolute left-0 text-lg">
						<Select
							icon={
								statistics.section === statisticsSecs[0].title
									? statisticsSecs[0].icon
									: statisticsSecs[1].icon
							}
							className="w-60"
							value={statistics.section}
							onValueChange={(value) => statistics.setSection(value)}
						>
							{statisticsSecs.map((section) => (
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
							value={statistics.selectedMonth}
							onValueChange={(value) => statistics.setSelectedMonth(value)}
						>
							{months.map((month) => (
								<SelectItem key={`month-${month.value}`} value={month.value}>
									{month.name}
								</SelectItem>
							))}
						</Select>
						<Select
							value={statistics.selectedYear}
							onValueChange={(value) => statistics.setSelectedYear(value)}
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
						statisticsSecs[0].title === statistics.section
							? "grid grid-cols-4 gap-2"
							: "",
						"mt-1",
					)}
				>
					{statisticsSecs[0].title === statistics.section &&
						customers.map((customer) => (
							<Customer
								key={customer.id}
								customer={customer}
								selectedMonth={statistics.selectedMonth}
								selectedYear={statistics.selectedYear}
								selectedCCustomers={
									statistics.calendarFilters.selectedCCustomers
								}
								setSelectedCCustomers={
									statistics.calendarFilters.setSelectedCCustomers
								}
							/>
						))}
					{statisticsSecs[1].title === statistics.section && (
						<WorkersList
							page={statistics.pages}
							setPage={statistics.setPages}
							filters={statistics.filters}
							generateExcel={generateExcel}
							year={statistics.selectedYear}
						/>
					)}
				</main>
			</Card>
		</Grid>
	);
}
