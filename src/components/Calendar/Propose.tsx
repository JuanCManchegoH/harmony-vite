import { Select, SelectItem } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { months, years } from "../../utils/dates";

export default function Propose({
	targetMonth,
	setTargetMonth,
	targetYear,
	setTargetYear,
}: {
	targetMonth: string;
	setTargetMonth: Dispatch<SetStateAction<string>>;
	targetYear: string;
	setTargetYear: Dispatch<SetStateAction<string>>;
}) {
	return (
		<div className="flex items-center gap-2">
			<Select
				value={targetMonth}
				onValueChange={(value) => setTargetMonth(value)}
			>
				{months.map((month) => (
					<SelectItem key={`month-${month.value}`} value={month.value}>
						{month.name}
					</SelectItem>
				))}
			</Select>
			<Select
				value={targetYear}
				onValueChange={(value) => setTargetYear(value)}
			>
				{years.map((year) => (
					<SelectItem key={`year-${year}`} value={year.value}>
						{year.name}
					</SelectItem>
				))}
			</Select>
		</div>
	);
}
