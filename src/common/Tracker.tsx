import { Color } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { ShiftWithId } from "../services/shifts/types";
import { InfoDropdownItem, InfoItem } from "./DropDown";
import Ping from "./Ping";

export interface TrackerItem {
	key: number | string;
	tooltip: string;
	color: Color;
	startTime: string;
	endTime: string;
	content?: string;
	events: ShiftWithId[];
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
			{data.map(({ key, startTime, endTime, color, events }, i) => {
				const schedule =
					schedules.findIndex(
						(schedule) =>
							schedule.startTime === startTime && schedule.endTime === endTime,
					) + 1;
				const hover = startTime ? `${startTime}-${endTime}` : "00:00-00:00";
				const lastItems = i === data.length - 1 || i === data.length - 2;
				return (
					<div
						key={key}
						className="w-full relative"
						onMouseEnter={() => setHoverSchedule(hover)}
						onMouseLeave={() => setHoverSchedule("")}
					>
						{events.length > 0 && <Ping color={color} />}
						<InfoDropdownItem
							key={key}
							className={`flex w-full items-center border-2 border-${color}-500 bg-${color}-100 rounded-md justify-center text-xs z-10`}
							btnText={schedule ? String(schedule) : "-"}
							position={lastItems ? "right" : undefined}
						>
							<InfoItem color={color}>
								{startTime} - {endTime}
							</InfoItem>
							{events.map((event) => (
								<InfoItem key={event.id} color={event.color}>
									{event.startTime} - {event.endTime}
								</InfoItem>
							))}
						</InfoDropdownItem>
					</div>
				);
			})}
		</div>
	);
}
