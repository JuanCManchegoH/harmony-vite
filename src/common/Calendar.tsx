import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction } from "react";
import classNames from "../utils/classNames";
import { DateToSring, MonthDay, getDay, weekDays } from "../utils/dates";

export default function Calendar({
	monthDays,
	selectedDays,
	setSelectedDays,
}: {
	monthDays: MonthDay[];
	selectedDays: string[];
	setSelectedDays: Dispatch<SetStateAction<string[]>>;
}) {
	const days = Object.values(weekDays);
	const handleSelectDay = (day: string) => {
		if (selectedDays.includes(day)) {
			setSelectedDays(selectedDays.filter((d) => d !== day));
		} else {
			setSelectedDays([...selectedDays, day]);
		}
	};
	const daysBefore = Array.from(Array(days.indexOf(monthDays[0].day))).map(
		(_, i) => i,
	);

	const handleColumnClick = (day: string) => {
		const daysInColumn = monthDays.filter((d) => d.day === day);
		if (daysInColumn.every((d) => selectedDays.includes(DateToSring(d.date)))) {
			setSelectedDays(
				selectedDays.filter(
					(d) => !daysInColumn.map((d) => DateToSring(d.date)).includes(d),
				),
			);
		}
		if (daysInColumn.some((d) => !selectedDays.includes(DateToSring(d.date)))) {
			setSelectedDays([
				...selectedDays.filter(
					(d) => !daysInColumn.map((d) => DateToSring(d.date)).includes(d),
				),
				...daysInColumn.map((d) => DateToSring(d.date)),
			]);
		}
	};

	return (
		<div className="border-y my-2">
			<div className="grid grid-cols-7 text-xs leading-6 text-gray-500 font-semibold">
				{days.map((day) => (
					<div key={day} className="text-center px-1 py-2">
						{day.substring(0, 2)}
					</div>
				))}
			</div>
			<div className="mt-1 grid grid-cols-7 gap-1 text-sm text-gray-900">
				{daysBefore.map((day) => (
					<div key={`bef-${day}`} className="px-1 py-2 text-center" />
				))}
				{monthDays.map((day) => (
					<div
						key={getDay(day.date)}
						className={classNames(
							day.isHoliday ? "text-rose-400" : "",
							"px-1 py-2 text-center",
						)}
					>
						<button
							type="button"
							className={classNames(
								day.isHoliday ? "border-rose-400" : "border-gray-400",
								selectedDays.includes(DateToSring(day.date))
									? "ring-2 ring-inset ring-sky-400"
									: "",
								"text-center py-1 px-2 rounded-md",
							)}
							onClick={() => handleSelectDay(DateToSring(day.date))}
						>
							{getDay(day.date)}
						</button>
					</div>
				))}
			</div>
			<div className="grid grid-cols-7 text-xs leading-6 text-gray-500 font-semibold">
				{days.map((day) => (
					<div key={day} className="flex flex-col items-center px-1 py-2">
						{/* if all monthdays with monthDay.day are selected show minus else show plus */}
						{monthDays
							.filter((d) => d.day === day)
							.every((d) => selectedDays.includes(DateToSring(d.date))) ? (
							<MinusIcon
								className="w-4 h-4 cursor-pointer"
								onClick={() => handleColumnClick(day)}
							/>
						) : (
							<PlusIcon
								className="w-4 h-4 cursor-pointer"
								onClick={() => handleColumnClick(day)}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
