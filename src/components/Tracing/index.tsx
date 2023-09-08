import { Card, Grid, Select, SelectItem } from "@tremor/react";
import { useAppSelector } from "../../hooks/store";
import { useTracing } from "../../hooks/useTracing";
import { months, years } from "../../utils/dates";
import Customer from "./Customer";

export default function Tracing() {
	const { profile } = useAppSelector((state) => state.auth);
	const { customers } = useAppSelector((state) => state.customers);
	const { tracingStalls } = useAppSelector((state) => state.stalls);
	const { tracingShifts } = useAppSelector((state) => state.shifts);
	const tracingData = useTracing(
		profile,
		customers,
		tracingStalls,
		tracingShifts,
	);
	return (
		<Grid numItems={1} className="gap-2 h-full p-2 pt-4">
			<Card className="p-1 overflow-y-auto bg-gray-50">
				<header className="flex justify-end items-center gap-2 border rounded-md p-1 sticky top-0 bg-gray-50 z-10">
					<h1 className="flex absolute left-2 font-bold text-lg">
						Programaciones
					</h1>
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
				<main className="grid grid-cols-4 gap-2 mt-2">
					{customers.map((customer) => (
						<Customer
							key={customer.id}
							customer={customer}
							tracingData={tracingData}
						/>
					))}
				</main>
			</Card>
		</Grid>
	);
}
