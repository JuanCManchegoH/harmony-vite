import { Cog6ToothIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Badge, Button } from "@tremor/react";
import { useState } from "react";
import { EventGroup } from ".";
import { useAppSelector } from "../../../hooks/store";
import { useHandleEvents } from "../../../hooks/useCalendar";
import { useShifts } from "../../../hooks/useShifts";
import classNames from "../../../utils/classNames";
import { validateRoles } from "../../../utils/roles";

export default function Group(group: EventGroup) {
	const { roles } = useAppSelector((state) => state.auth.profile);
	const { stalls } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const { deleteMany } = useShifts(shifts, stalls);
	const { handleDeleteEvents, selectedDelete, setSelectedDelete } =
		useHandleEvents();

	const [edit, setEdit] = useState(false);
	const addAndRemove = (id: string) => {
		if (selectedDelete.includes(id)) {
			setSelectedDelete(selectedDelete.filter((item) => item !== id));
		} else {
			setSelectedDelete([...selectedDelete, id]);
		}
	};

	return (
		<li className="p-2 border rounded-md">
			<header className="grid grid-cols-2 justify-between">
				<div className="col-span-2 flex justify-between border-b pb-1">
					<p className="col-span-2 text-sm font-semibold text-right">
						{group.workerName}
					</p>
					{validateRoles(roles, ["handle_shifts"], []) && (
						<Cog6ToothIcon
							className={classNames(
								"h-5 w-5 cursor-pointer hover:text-sky-400",
								edit ? "text-sky-500" : "text-gray-500",
							)}
							onClick={() => setEdit(!edit)}
						/>
					)}
				</div>
				<div className="truncate mt-2">
					<p className="text-sm font-semibold">{group.stallName}</p>
				</div>
				<div className="flex gap-1 justify-end font-semibold mt-1">
					<Badge size="xs" color="sky">
						{group.type === "customer" ? "Evento de cliente" : "Evento"}
					</Badge>
					<Badge size="xs" color={group.color}>
						{group.abbreviation} | {group.startTime} - {group.endTime}
					</Badge>
				</div>
			</header>
			<main>
				<section className="">
					<div className="py-1 grid grid-cols-7 place-items-center text-sm gap-2">
						{group.events.map((event) => (
							<Badge
								icon={edit ? XCircleIcon : undefined}
								key={`event-${event.id}`}
								size="xs"
								color={selectedDelete.includes(event.id) ? "rose" : "gray"}
								className={classNames(
									"font-semibold w-full",
									edit ? "cursor-pointer" : "",
								)}
								onClick={() => {
									edit && addAndRemove(event.id);
								}}
							>
								{event.day.slice(0, 5)}
							</Badge>
						))}
					</div>
					<section className="">
						<div className="p-2 text-sm border rounded-md">
							<label
								htmlFor="name"
								className="block text-xs font-medium text-gray-900"
							>
								Descripción
							</label>
							{group.description}
						</div>
					</section>
					<div className="flex justify-end">
						{validateRoles(roles, ["handle_shifts"], []) && edit && (
							<Button
								variant="primary"
								color="rose"
								size="xs"
								className="mt-1"
								onClick={() => {
									handleDeleteEvents(deleteMany, group.stall);
									setEdit(false);
								}}
							>
								Eliminar eventos
							</Button>
						)}
					</div>
				</section>
			</main>
			<footer className="flex justify-between mt-1 border-t pt-1">
				<div className="flex gap-2">
					<div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500">
						<span className="leading-none text-xs text-white font-pacifico">
							{group.createdBy[0]}
						</span>
					</div>
					<p className="flex text-xs items-center">{group.createdBy}</p>
				</div>
				<div className="flex items-center gap-2">
					<p className="flex text-xs items-center">{group.createdAt}</p>
				</div>
			</footer>
		</li>
	);
}
