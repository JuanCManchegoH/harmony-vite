import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { Badge, Select, SelectItem } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { ColorGroup, sequenceGroups } from "../utils/colors";
import { getHour, hours, minutes } from "../utils/hours";
import ColorSelector from "./ColorSelector";

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
	selectedColor,
	setSelectedColor,
}: {
	times: Times;
	setTimes: Dispatch<SetStateAction<Times>>;
	selectedColor: ColorGroup;
	setSelectedColor: Dispatch<SetStateAction<ColorGroup>>;
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
				<div className="flex gap-2">
					<ColorSelector
						colorsGroup={sequenceGroups}
						selectedColor={selectedColor}
						setSelectedColor={setSelectedColor}
					/>
					<Badge color={selectedColor.color}>{selectedColor.name}</Badge>
				</div>
				<ArrowsRightLeftIcon
					title="Intercambiar horas"
					className="w-5 h-5 cursor-pointer hover:text-sky-500"
					onClick={() => exchange()}
				/>
			</div>
			<>
				<div className="flex items-center col-span-2 gap-2">
					<Badge color={selectedColor.color} className="w-24">
						{selectedColor.name === "Turno"
							? `Inicio | ${getHour(times.selectedStartHour)}:${getHour(
									times.selectedStartMinute,
							  )}`
							: "Inicio | 00:00"}
					</Badge>
					<Select
						disabled={selectedColor.name === "Descanso"}
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
						disabled={selectedColor.name === "Descanso"}
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
					<Badge color={selectedColor.color} className="w-24">
						{selectedColor.name === "Turno"
							? `Final | ${getHour(times.selectedEndHour)}:${getHour(
									times.selectedEndMinute,
							  )}`
							: "Final | 00:00"}
					</Badge>
					<Select
						disabled={selectedColor.name === "Descanso"}
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
						disabled={selectedColor.name === "Descanso"}
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
		</>
	);
}
