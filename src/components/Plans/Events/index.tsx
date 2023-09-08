import { FlagIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction } from "react";
import { eventTypes } from "..";
import RightModal from "../../../common/RightModal";
import { useAppSelector } from "../../../hooks/store";
import { ShiftWithId } from "../../../services/shifts/types";
import Group from "./Group";

export interface EventGroup extends ShiftWithId {
	events: ShiftWithId[];
}

export default function Events({
	open,
	setOpen,
}: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {
	const { plansShifts } = useAppSelector((state) => state.shifts);
	const events = plansShifts.filter((shift) => eventTypes.includes(shift.type));

	const groupedEvents: EventGroup[] = events.reduce(
		(acc: EventGroup[], event: ShiftWithId) => {
			const keyProps = [
				"worker",
				"color",
				"startTime",
				"endTime",
				"type",
				"createdBy",
				"createdAt",
				"stall",
				"sequence",
				"position",
				"description",
			];
			const existingGroup = acc.find((group) =>
				keyProps.every(
					(prop) =>
						group[prop as keyof EventGroup] ===
						event[prop as keyof typeof event],
				),
			);

			if (existingGroup) {
				existingGroup.events.push(event);
			} else {
				acc.push({ ...event, events: [event] });
			}

			return acc;
		},
		[],
	);

	return (
		<RightModal open={open} setOpen={setOpen} icon={FlagIcon} title="Eventos">
			<ul className="flex flex-col gap-2">
				{groupedEvents.map((group) => (
					<Group key={group.id} {...group} />
				))}
			</ul>
		</RightModal>
	);
}
