import {
	IdentificationIcon,
	PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { Badge, Button } from "@tremor/react";
import { useState } from "react";
import { EventGroup } from ".";
import Label from "../../../common/Label";
import { useHandleEvents } from "../../../hooks/Handlers/usePlans";
import { useAppSelector } from "../../../hooks/store";
import { useShifts } from "../../../hooks/useShifts";
import classNames from "../../../utils/classNames";
import { validateRoles } from "../../../utils/roles";

export default function Group(group: EventGroup) {
	const { profile } = useAppSelector((state) => state.auth);
	const { plansStalls } = useAppSelector((state) => state.stalls);
	const { plansShifts } = useAppSelector((state) => state.shifts);
	const { deleteMany } = useShifts(plansShifts, plansStalls);
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
			<header className="flex justify-between">
				<div className="flex gap-2">
					<div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500">
						<span className="leading-none text-xs text-white font-pacifico">
							{group.createdBy[0]}
						</span>
					</div>
					<p className="flex text-sm items-center">{group.createdBy}</p>
				</div>
				<div className="flex items-center gap-2">
					<p className="flex text-xs items-center">{group.createdAt}</p>
					{validateRoles(
						profile.roles,
						[],
						["handle_stalls", "handle_events"],
					) && (
						<PencilSquareIcon
							className={classNames(
								"h-5 w-5 cursor-pointer hover:text-sky-400",
								edit ? "text-sky-500" : "text-gray-500",
							)}
							onClick={() => setEdit(!edit)}
						/>
					)}
				</div>
			</header>
			<main className="border-t mt-2">
				<section className="flex justify-between">
					<div className="flex gap-2 items-center">
						<IdentificationIcon className="h-5 w-5 text-sky-500" />
						<p className="text-sm font-semibold">{group.workerName}</p>
					</div>
					<p className="text-sm font-semibold">
						{group.stallName} - {group.abbreviation}
					</p>
				</section>
				<section className="mt-4">
					<Label text="Descripción">
						<div className="p-2 text-sm border rounded-md">
							{group.description}
						</div>
					</Label>
				</section>
				<section className="mt-4">
					<Label text="Fechas">
						<div
							className={classNames(
								"p-2 grid grid-cols-7 place-items-center text-sm border rounded-md",
								edit ? "border-2 border-sky-500" : "",
							)}
						>
							{group.events.map((event) => (
								<Badge
									key={`event-${event.id}`}
									size="xs"
									color={selectedDelete.includes(event.id) ? "rose" : "gray"}
									className={classNames(
										"font-semibold",
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
					</Label>
					<div className="flex justify-end">
						{edit && (
							<Button
								variant="primary"
								color="rose"
								size="xs"
								className="mt-2"
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
		</li>
	);
}
