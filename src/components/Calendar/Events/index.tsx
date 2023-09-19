import { FlagIcon } from "@heroicons/react/24/solid";
import { Text } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import EmptyState from "../../../common/EmptyState";
import RightModal from "../../../common/RightModal";
import { useAppSelector } from "../../../hooks/store";
import { ShiftWithId, eventTypes } from "../../../services/shifts/types";
import Group from "./Group";

export interface EventGroup extends ShiftWithId {
	events: ShiftWithId[];
}

export default function Events({
	open,
	setOpen,
	customer,
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	customer?: string;
}) {
	const { shifts } = useAppSelector((state) => state.shifts);
	const events = shifts.filter((shift) => eventTypes.includes(shift.type));
	const title = customer ? `Eventos - ${customer}` : "Eventos";

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
		<RightModal open={open} setOpen={setOpen} icon={FlagIcon} title={title}>
			<ul className="flex flex-col gap-2">
				{groupedEvents.length === 0 && (
					<div>
						<EmptyState>
							<FlagIcon className="w-10 h-10 text-sky-500" />
							<Text>
								Aqui aparecerán los eventos relacionados con el cliente.
							</Text>
						</EmptyState>
					</div>
				)}
				{groupedEvents.map((group) => (
					<Group key={group.id} {...group} />
				))}
			</ul>
		</RightModal>
	);
}
