import {
	Badge,
	DateRangePicker,
	DateRangePickerValue,
	MultiSelect,
	MultiSelectItem,
} from "@tremor/react";
import { es } from "date-fns/locale";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomToggle from "../../common/CustomToggle";
import { ShiftWithId } from "../../services/shifts/types";
import { getDays, getSelectedDays } from "../../utils/dates";

export default function DeleteShifts({
	shifts,
	selectedDelete,
	setSelectedDelete,
	month,
	year,
}: {
	shifts: ShiftWithId[];
	selectedDelete: string[];
	setSelectedDelete: Dispatch<SetStateAction<string[]>>;
	month: string;
	year: string;
}) {
	const daysInMonth = getDays(month, year);
	const [isRange, setIsRange] = useState(false);
	const [dates, setDates] = useState<DateRangePickerValue>({
		from: daysInMonth[0].date,
		to: daysInMonth[0].date,
	});

	useEffect(() => {
		if (isRange && dates.from && dates.to) {
			const selectedDates = getSelectedDays(dates.from, dates.to);
			setSelectedDelete(
				shifts
					.filter(({ day }) => selectedDates.includes(day))
					.map(({ id }) => id),
			);
		}
	}, [isRange, dates]);

	return (
		<form className="grid grid-cols-2 gap-2">
			<div className="col-start-2 flex justify-end gap-2">
				{!isRange && (
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
				)}
				<CustomToggle
					enabled={isRange}
					setEnabled={setIsRange}
					values={{ enabled: "R", disabled: "T" }}
				/>
			</div>
			{!isRange && (
				<MultiSelect
					className="col-span-2"
					placeholder="Seleccionar turnos a eliminar"
					value={selectedDelete}
					onValueChange={(vaule) => setSelectedDelete(vaule)}
				>
					{shifts
						.sort((a, b) => {
							if (a.day > b.day) return 1;
							if (a.day < b.day) return -1;
							return 0;
						})
						.map(({ day, startTime, endTime, id }) => {
							const timesRange =
								startTime === endTime
									? "Descanso"
									: `${startTime} - ${endTime}`;
							return (
								<MultiSelectItem value={id}>
									{day} | {timesRange}
								</MultiSelectItem>
							);
						})}
				</MultiSelect>
			)}
			{isRange && (
				<div className="col-span-2 flex justify-center">
					<DateRangePicker
						value={dates}
						minDate={daysInMonth[0].date}
						maxDate={daysInMonth[daysInMonth.length - 1].date}
						enableSelect={false}
						onValueChange={setDates}
						locale={es}
						selectPlaceholder="Seleccionar rango de fechas"
						color="rose"
					/>
				</div>
			)}
		</form>
	);
}
