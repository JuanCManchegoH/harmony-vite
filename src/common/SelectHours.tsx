import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { Select, SelectItem } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { getHour, hours, minutes } from "../utils/hours";
import Label from "./Label";
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
			<div className="col-span-1">
				<Label text={isShift ? "Hora inicio" : "Descanso"}>
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
				</Label>
			</div>
			<div className="col-span-1">
				<Label
					text={
						isShift
							? `${getHour(times.selectedStartHour)}:${getHour(
									times.selectedStartMinute,
							  )}`
							: "Descanso"
					}
				>
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
				</Label>
			</div>
			<div className="col-span-1">
				<Label text={isShift ? "Hora fin" : "Descanso"}>
					<Select
						className="w-full"
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
				</Label>
			</div>
			<div className="col-span-1">
				<Label
					text={
						isShift
							? `${getHour(times.selectedEndHour)}:${getHour(
									times.selectedEndMinute,
							  )}`
							: "Descanso"
					}
				>
					<Select
						className="w-full"
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
				</Label>
			</div>
			<div className="col-span-1 flex justify-between px-2">
				<label className="text-sm font-semibold">Turno o descanso</label>
				<ShiftToggle enabled={isShift} setEnabled={setIsShift} />
			</div>
			<div className="col-span-1 flex justify-between px-2">
				<label className="text-sm font-semibold">Intercambiar horas</label>
				<ArrowsRightLeftIcon
					title="Intercambiar horas"
					className="w-5 h-5 cursor-pointer hover:text-sky-500"
					onClick={() => exchange()}
				/>
			</div>
		</>
	);
}
