import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { Badge, Select, SelectItem } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { getHour, hours, minutes } from "../utils/hours";
import ShiftToggle from "./ShiftToggle";

export interface Times {
	name?: string;
	selectedStartHour: string;
	selectedStartMinute: string;
	selectedEndHour: string;
	selectedEndMinute: string;
}

export default function SelectHours({
	times,
	setTimes,
	isShift,
	setIsShift,
}: {
	times: Times;
	setTimes: Dispatch<SetStateAction<Times>>;
	isShift: boolean;
	setIsShift: Dispatch<SetStateAction<boolean>>;
}) {
	const exchange = () => {
		setTimes({
			...times,
			selectedStartHour: times.selectedEndHour,
			selectedStartMinute: times.selectedEndMinute,
			selectedEndHour: times.selectedStartHour,
			selectedEndMinute: times.selectedStartMinute,
		});
	};

	return (
		<>
			<div className="col-span-2 flex justify-between items-center bg-gray-50 border rounded-md p-2">
				<ShiftToggle enabled={isShift} setEnabled={setIsShift} />
				<ArrowsRightLeftIcon
					title="Intercambiar horas"
					className="w-5 h-5 cursor-pointer hover:text-sky-500"
					onClick={() => exchange()}
				/>
			</div>
			<div className="flex items-center col-span-2 gap-2">
				<Badge color={isShift ? "green" : "gray"} className="w-24">
					{isShift
						? `Inicio | ${getHour(times.selectedStartHour)}:${getHour(
								times.selectedStartMinute,
						  )}`
						: "Descanso"}
				</Badge>
				<Select
					disabled={!isShift}
					value={times.selectedStartHour}
					onValueChange={(value) =>
						setTimes({ ...times, selectedStartHour: value })
					}
				>
					{hours.map((hour) => (
						<SelectItem key={hour} value={hour.toString()}>
							{hour}
						</SelectItem>
					))}
				</Select>
				<Select
					disabled={!isShift}
					placeholder="Minuto inicio"
					value={times.selectedStartMinute}
					onValueChange={(value) =>
						setTimes({ ...times, selectedStartMinute: value })
					}
				>
					{minutes.map((minute) => (
						<SelectItem key={minute} value={minute.toString()}>
							{minute}
						</SelectItem>
					))}
				</Select>
			</div>

			<div className="flex items-center col-span-2 gap-2">
				<Badge color={isShift ? "green" : "gray"} className="w-24">
					{isShift
						? `Final | ${getHour(times.selectedEndHour)}:${getHour(
								times.selectedEndMinute,
						  )}`
						: "Descanso"}
				</Badge>
				<Select
					disabled={!isShift}
					placeholder="Hora fin"
					value={times.selectedEndHour}
					onValueChange={(value) =>
						setTimes({ ...times, selectedEndHour: value })
					}
				>
					{hours.map((hour) => (
						<SelectItem key={hour} value={hour.toString()}>
							{hour}
						</SelectItem>
					))}
				</Select>
				<Select
					disabled={!isShift}
					placeholder="Minuto fin"
					value={times.selectedEndMinute}
					onValueChange={(value) =>
						setTimes({ ...times, selectedEndMinute: value })
					}
				>
					{minutes.map((minute) => (
						<SelectItem key={minute} value={minute.toString()}>
							{minute}
						</SelectItem>
					))}
				</Select>
			</div>
		</>
	);
}
