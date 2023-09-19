import { ShiftWithId } from "../services/shifts/types";
import { InfoDropdownItem, InfoItem } from "./DropDown";

export interface TrackerItem {
	key: string;
	events: ShiftWithId[];
}

export default function Tracker({
	data,
}: {
	data: TrackerItem[];
}) {
	return (
		<div className="flex justify-between w-full gap-1 h-4">
			{data.map(({ key, events }, i) => {
				const lastItems = i === data.length - 1 || i === data.length - 2;
				const color =
					events.length > 0 ? events[events.length - 1].color : "gray";
				return (
					<div key={key} className="w-full relative">
						<InfoDropdownItem
							className={`flex w-full items-center border-2 border-${color}-500 bg-${color}-100 text-${color}-500 rounded-full justify-center text-xs z-10 font-bold`}
							btnText={events.length > 0 ? events.length.toString() : "-"}
							position={lastItems ? "right" : undefined}
						>
							{events.map((event) => (
								<InfoItem key={event.id} color={event.color}>
									{event.abbreviation} | {event.startTime} - {event.endTime}
								</InfoItem>
							))}
						</InfoDropdownItem>
					</div>
				);
			})}
		</div>
	);
}
