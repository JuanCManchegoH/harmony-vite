import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { Badge, Select, SelectItem } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import ShiftToggle from "../../../common/ShiftToggle";
import { useAppSelector } from "../../../hooks/store";
import { HandleShiftsData } from "../../../hooks/useShifts";
import { Convention } from "../../../services/company/types";
import classNames from "../../../utils/classNames";
import { DateToSring, MonthDay, getDay, weekDays } from "../../../utils/dates";
import { getHour, hours, minutes } from "../../../utils/hours";

export default function CalendarUpdate({
	monthDays,
	selectedDays,
	setSelectedDays,
	data,
	setData,
	selectedConvention,
	setSelectedConvention,
}: {
	monthDays: MonthDay[];
	selectedDays: string[];
	setSelectedDays: Dispatch<SetStateAction<string[]>>;
	data: HandleShiftsData;
	setData: Dispatch<SetStateAction<HandleShiftsData>>;
	selectedConvention?: Convention | undefined;
	setSelectedConvention?: Dispatch<SetStateAction<Convention | undefined>>;
}) {
	const { conventions } = useAppSelector((state) => state.auth.profile.company);
	const allConventions: Convention[] = [
		{
			id: "ADICIONAL",
			name: "ADICIONAL",
			color: "yellow",
			abbreviation: "AD",
			keep: true,
		},
		{
			id: "TURNO",
			name: "TURNO",
			color: "green",
			abbreviation: "T",
			keep: true,
		},
		...conventions,
	];

	const days = Object.values(weekDays);
	const handleSelectDay = (day: string) => {
		if (selectedDays.includes(day)) {
			setSelectedDays(selectedDays.filter((d) => d !== day));
		} else {
			setSelectedDays([...selectedDays, day]);
		}
	};
	const daysBefore = Array.from(Array(days.indexOf(monthDays[0].day))).map(
		(_, i) => i,
	);
	const handleColumnClick = (day: string) => {
		const daysInColumn = monthDays.filter((d) => d.day === day);
		if (daysInColumn.every((d) => selectedDays.includes(DateToSring(d.date)))) {
			setSelectedDays(
				selectedDays.filter(
					(d) => !daysInColumn.map((d) => DateToSring(d.date)).includes(d),
				),
			);
		}
		if (daysInColumn.some((d) => !selectedDays.includes(DateToSring(d.date)))) {
			setSelectedDays([
				...selectedDays.filter(
					(d) => !daysInColumn.map((d) => DateToSring(d.date)).includes(d),
				),
				...daysInColumn.map((d) => DateToSring(d.date)),
			]);
		}
	};
	const exchange = () => {
		setData({
			...data,
			selectedStartHour: data.selectedEndHour,
			selectedStartMinute: data.selectedEndMinute,
			selectedEndHour: data.selectedStartHour,
			selectedEndMinute: data.selectedStartMinute,
		});
	};
	return (
		<form className="grid grid-cols-2 grid-rows-5 gap-2">
			<section className="flex w-full row-span-4">
				<div className="w-full">
					<div className="border-b grid grid-cols-7 text-xs leading-6 text-gray-500 font-semibold">
						{days.map((day) => (
							<button
								type="button"
								key={day}
								className="text-center p-1 hover:text-sky-500"
								onClick={() => handleColumnClick(day)}
							>
								{day.substring(0, 2)}
							</button>
						))}
					</div>
					<div className="mt-1 grid grid-cols-7 text-sm text-gray-900">
						{daysBefore.map((day) => (
							<div key={`bef-${day}`} className="px-1 py-2 text-center" />
						))}
						{monthDays.map((day) => (
							<div
								key={getDay(day.date)}
								className={classNames(
									day.isHoliday ? "text-rose-400" : "",
									"p-1 text-center",
								)}
							>
								<button
									type="button"
									className={classNames(
										day.isHoliday ? "border-rose-400" : "border-gray-400",
										selectedDays.includes(DateToSring(day.date))
											? "bg-sky-400 text-white"
											: "",
										"text-center py-1 px-2 rounded-md",
									)}
									onClick={() => handleSelectDay(DateToSring(day.date))}
								>
									{getDay(day.date)}
								</button>
							</div>
						))}
					</div>
				</div>
			</section>
			<div className="flex items-center gap-2">
				<Select
					disabled={!data.isShift}
					value={data.selectedStartHour}
					onValueChange={(value) =>
						setData({ ...data, selectedStartHour: value })
					}
				>
					{hours.map((hour) => (
						<SelectItem key={hour} value={hour.toString()}>
							{hour}
						</SelectItem>
					))}
				</Select>
				<Badge color={data.isShift ? "green" : "gray"} className="w-24">
					{data.isShift ? "Inicio" : "Descanso"}
				</Badge>
			</div>
			<div className="flex items-center gap-2">
				<Select
					disabled={!data.isShift}
					placeholder="Minuto inicio"
					value={data.selectedStartMinute}
					onValueChange={(value) =>
						setData({ ...data, selectedStartMinute: value })
					}
				>
					{minutes.map((minute) => (
						<SelectItem key={minute} value={minute.toString()}>
							{minute}
						</SelectItem>
					))}
				</Select>
				<Badge color={data.isShift ? "green" : "gray"} className="w-24">
					{data.isShift
						? `${getHour(data.selectedStartHour)}:${getHour(
								data.selectedStartMinute,
						  )}`
						: "Descanso"}
				</Badge>
			</div>
			<div className="flex items-center gap-2">
				<Select
					className="w-full"
					disabled={!data.isShift}
					placeholder="Hora fin"
					value={data.selectedEndHour}
					onValueChange={(value) =>
						setData({ ...data, selectedEndHour: value })
					}
				>
					{hours.map((hour) => (
						<SelectItem key={hour} value={hour.toString()}>
							{hour}
						</SelectItem>
					))}
				</Select>
				<Badge color={data.isShift ? "green" : "gray"} className="w-24">
					{data.isShift ? "Final" : "Descanso"}
				</Badge>
			</div>
			<div className="flex items-center gap-2">
				<Select
					className="w-full"
					disabled={!data.isShift}
					placeholder="Minuto fin"
					value={data.selectedEndMinute}
					onValueChange={(value) =>
						setData({ ...data, selectedEndMinute: value })
					}
				>
					{minutes.map((minute) => (
						<SelectItem key={minute} value={minute.toString()}>
							{minute}
						</SelectItem>
					))}
				</Select>
				<Badge color={data.isShift ? "green" : "gray"} className="w-24">
					{data.isShift
						? `${getHour(data.selectedEndHour)}:${getHour(
								data.selectedEndMinute,
						  )}`
						: "Descanso"}
				</Badge>
			</div>

			<div
				className={classNames(
					"flex justify-between items-center bg-gray-50 border rounded-md p-2",
					setSelectedConvention ? "" : "col-span-2",
				)}
			>
				<ShiftToggle
					enabled={data.isShift}
					setEnabled={() => setData({ ...data, isShift: !data.isShift })}
				/>
				<ArrowsRightLeftIcon
					title="Intercambiar horas"
					className="w-5 h-5 cursor-pointer hover:text-sky-500"
					onClick={() => exchange()}
				/>
			</div>
			{/* Event */}
			{setSelectedConvention && (
				<div className="flex items-center gap-2">
					<Select
						className="w-full"
						placeholder="Convención"
						value={selectedConvention?.name || ""}
						disabled={!data.isShift}
						onValueChange={(value) =>
							setSelectedConvention(
								allConventions.find((item) => item.name === value),
							)
						}
					>
						{allConventions.map((item) => (
							<SelectItem key={item?.id} value={item?.name || ""}>
								{item?.name}
							</SelectItem>
						))}
					</Select>
				</div>
			)}
		</form>
	);
}
