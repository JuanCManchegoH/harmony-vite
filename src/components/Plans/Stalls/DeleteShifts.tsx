import { Badge, MultiSelect, MultiSelectItem } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { ShiftWithId } from "../../../services/shifts/types";

export default function DeleteShifts({
	shifts,
	selectedDelete,
	setSelectedDelete,
}: {
	shifts: ShiftWithId[];
	selectedDelete: string[];
	setSelectedDelete: Dispatch<SetStateAction<string[]>>;
}) {
	return (
		<form className="grid grid-cols-2 gap-2">
			<div className="col-start-2 flex justify-end">
				<Badge
					color="sky"
					size="xs"
					onClick={
						selectedDelete.length === shifts.length
							? () => setSelectedDelete([])
							: () => setSelectedDelete(shifts.map(({ id }) => id))
					}
					className="cursor-pointer select-none hover:ring-2 hover:ring-sky-500 transition-all ease-in-out duration-100"
				>
					{selectedDelete.length === shifts.length
						? "Deseleccionar todos"
						: "Seleccionar todos"}
				</Badge>
			</div>
			<MultiSelect
				className="col-span-2"
				placeholder="Seleccionar turnos a eliminar"
				value={selectedDelete}
				onValueChange={(vaule) => setSelectedDelete(vaule)}
			>
				{shifts.map(({ day, startTime, endTime, id }) => {
					const timesRange =
						startTime === endTime ? "Descanso" : `${startTime} - ${endTime}`;
					return (
						<MultiSelectItem value={id}>
							{day} | {timesRange}
						</MultiSelectItem>
					);
				})}
			</MultiSelect>
		</form>
	);
}
