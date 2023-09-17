import classNames from "../../utils/classNames";
import { MonthDay, getDay, weekDays } from "../../utils/dates";

export default function StallCalendar({
	monthDays,
}: { monthDays: MonthDay[] }) {
	const days = Object.values(weekDays);
	const daysBefore = Array.from(Array(days.indexOf(monthDays[0].day))).map(
		(_, i) => i,
	);
	return (
		<div className="my-2">
			<div className="grid grid-cols-7 text-xs leading-6 bg-gray-100 text-gray-700 rounded-md font-bold">
				{days.map((day) => (
					<div key={day} className="text-center px-1 py-2">
						{day.substring(0, 3)}
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
							"p-2 text-center border rounded-md font-bold",
						)}
					>
						<div className="text-left">{getDay(day.date)}</div>
					</div>
				))}
			</div>
		</div>
	);
}
