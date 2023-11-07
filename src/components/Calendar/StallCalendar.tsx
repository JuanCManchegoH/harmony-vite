import { ClockIcon } from "@heroicons/react/24/solid";
import { Badge, Text } from "@tremor/react";
import { Dispatch, SetStateAction, useState } from "react";
import EmptyState from "../../common/EmptyState";
import Ping from "../../common/Ping";
import { useAppSelector } from "../../hooks/store";
import { abbreviationColors } from "../../services/shifts/types";
import { StallWithId } from "../../services/stalls/types";
import classNames from "../../utils/classNames";
import { colorOps } from "../../utils/colors";
import { DateToSring, MonthDay, getDay, weekDays } from "../../utils/dates";
import { getDiference, getSchedules, minutesToString } from "../../utils/hours";
import { hours } from "../Statistics/WorkersList";

export default function StallCalendar({
	monthDays,
	stall,
	selectedDay,
	setSelectedDay,
	selectedWorker,
}: {
	monthDays: MonthDay[];
	stall?: StallWithId;
	selectedDay: string;
	setSelectedDay: Dispatch<SetStateAction<string>>;
	selectedWorker: string;
}) {
	const { shifts } = useAppSelector((state) => state.shifts);

	const stallShifts = shifts.filter((shift) => shift.stall === stall?.id) || [];
	const days = Object.values(weekDays);
	const daysBefore = Array.from(Array(days.indexOf(monthDays[0].day))).map(
		(_, i) => i,
	);
	const [hoverSchedule, setHoverSchedule] = useState<string>("");
	const schedules = [
		{ startTime: "00:00", endTime: "00:00" },
		...getSchedules(stallShifts),
	].sort((a, b) => {
		if (a.startTime === b.startTime) {
			return a.endTime > b.endTime ? 1 : -1;
		}
		return a.startTime > b.startTime ? 1 : -1;
	});
	const plus = hours(
		stallShifts.filter((s) => s.color === "green" || s.color === "yellow"),
	);
	const sub = hours(
		stallShifts.filter((s) => s.color === "red" || s.color === "sky"),
	);

	const totalHours = plus - sub;

	return (
		<div className="my-2">
			<section className="flex flex-wrap my-2 gap-2">
				{schedules.map((schedule, i) => {
					const content =
						schedule.startTime === schedule.endTime
							? "Sin horario"
							: `H${i} > ${schedule.startTime}-${schedule.endTime}`;
					return (
						<Badge
							icon={ClockIcon}
							key={`${schedule.startTime}-${schedule.endTime}`}
							className="font-bold"
							color={
								hoverSchedule === `${schedule.startTime}-${schedule.endTime}`
									? "sky"
									: "gray"
							}
							size="xs"
						>
							{content}
						</Badge>
					);
				})}
			</section>
			{stall ? (
				<div className="p-2 flex justify-center">
					<Badge color="sky" className="font-bold">
						{stall.name}: {totalHours} Horas
					</Badge>
				</div>
			) : null}
			<div className="grid grid-cols-7 text-sm leading-6 bg-gray-100 text-gray-700 rounded-md font-bold">
				{days.map((day) => (
					<div key={day} className="text-center px-1 py-2">
						{day.substring(0, 3)}
					</div>
				))}
			</div>
			<div className="my-2 grid grid-cols-7 gap-1 text-sm text-gray-900">
				{daysBefore.map((day) => (
					<div key={`bef-${day}`} className="px-1 py-2 text-center" />
				))}
				{monthDays.map((day) => {
					const shifts = stallShifts.filter(
						(shift) => shift.day === DateToSring(day.date),
					);
					const minutes = shifts.reduce((acc, shift) => {
						if (colorOps.add.includes(shift.color)) {
							return acc + getDiference(shift.startTime, shift.endTime).minutes;
						}
						if (colorOps.sub.includes(shift.color)) {
							return acc - getDiference(shift.startTime, shift.endTime).minutes;
						}
						return acc;
					}, 0);
					return (
						<div
							key={getDay(day.date)}
							className={classNames(
								day.isHoliday ? "text-rose-400" : "",
								"p-2 text-center border rounded-md font-bold",
							)}
						>
							<button
								type="button"
								onClick={() => setSelectedDay(getDay(day.date))}
								className="flex items-center justify-between border-b pb-2 w-full"
							>
								<p className="text-base underline">{getDay(day.date)} </p>
								<span
									className={classNames(
										selectedDay === getDay(day.date)
											? "bg-sky-500"
											: "bg-gray-800",
										"text-sm text-gray-100 rounded-full px-2",
									)}
								>
									{minutesToString(minutes)}
								</span>
							</button>
							<div className="grid grid-cols-3 gap-1 py-2">
								{shifts.length === 0 && (
									<div className="col-span-3">
										<EmptyState>
											<Text className="text-gray-600">Vacio</Text>
										</EmptyState>
									</div>
								)}
								{shifts
									.sort((a, b) => {
										const nameA = a.workerName.toLowerCase();
										const nameB = b.workerName.toLowerCase();
										if (nameA < nameB) return -1;
										if (nameA > nameB) return 1;
										return 0;
									})
									.map(
										({
											id,
											color,
											startTime,
											endTime,
											workerName,
											worker,
											abbreviation,
										}) => {
											const schedule = schedules.findIndex(
												(schedule) =>
													schedule.startTime === startTime &&
													schedule.endTime === endTime,
											);
											const hover = startTime
												? `${startTime}-${endTime}`
												: "00:00-00:00";
											const tooltip = `${workerName} | ${startTime} - ${endTime}`;
											const isWorker = worker === selectedWorker;
											const isStallWorker = stall?.workers?.some(
												(stallWorker) => stallWorker.id === worker,
											);

											const shiftContent = !schedule ? "X" : `H${schedule}`;
											const content = abbreviationColors.includes(color)
												? abbreviation
												: shiftContent;
											return (
												<Badge
													tooltip={tooltip}
													key={id}
													size="xs"
													color={color}
													className={classNames(
														isStallWorker ? "border-2" : "",
														!isWorker && selectedWorker !== ""
															? "opacity-20"
															: "",
														`w-full border-${color}-500 p-0 relative`,
													)}
													onMouseEnter={() => setHoverSchedule(hover)}
													onMouseLeave={() => setHoverSchedule("")}
												>
													{isWorker && <Ping color={color} />}
													{content}
												</Badge>
											);
										},
									)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
