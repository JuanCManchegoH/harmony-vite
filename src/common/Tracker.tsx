import { Color } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";

export interface TrackerItem {
	key: number | string;
	tooltip: string;
	color: Color;
	startTime: string;
	endTime: string;
	content?: string;
}

export default function Tracker({
	data,
	schedules,
	setHoverSchedule,
}: {
	data: TrackerItem[];
	schedules: { startTime: string; endTime: string }[];
	setHoverSchedule: Dispatch<SetStateAction<string>>;
}) {
	return (
		<div className="flex justify-between w-full gap-1 h-4">
			{data.map(({ key, startTime, endTime, color, tooltip }) => {
				const schedule =
					schedules.findIndex(
						(schedule) =>
							schedule.startTime === startTime && schedule.endTime === endTime,
					) + 1;
				const hover = startTime ? `${startTime}-${endTime}` : "00:00-00:00";
				return (
					<div
						key={key}
						className={`flex items-center w-full p-2 border-2 border-${color}-500 bg-${color}-100 rounded-md select-none cursor-default`}
						title={`${hover} | ${tooltip}`}
						onMouseEnter={() => setHoverSchedule(hover)}
						onMouseLeave={() => setHoverSchedule("")}
					>
						<p
							className={`text-${color}-600 text-center w-full text-xs font-semibold`}
						>
							{schedule || "-"}
						</p>
					</div>
				);
			})}
		</div>
	);
}
