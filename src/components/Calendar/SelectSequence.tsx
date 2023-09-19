import { Badge, Select, SelectItem, Text } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "../../hooks/store";
import { Sequence } from "../../services/company/types";
import classNames from "../../utils/classNames";
import { DateToSring, MonthDay } from "../../utils/dates";

export default function SelectSequence({
	monthDays,
	selectedSequence,
	setSelectedSequence,
	selectedIndex,
	setSelectedIndex,
	jump,
	setJump,
}: {
	monthDays: MonthDay[];
	selectedSequence: Sequence | undefined;
	setSelectedSequence: Dispatch<SetStateAction<Sequence | undefined>>;
	selectedIndex: number;
	setSelectedIndex: Dispatch<SetStateAction<number>>;
	jump: number;
	setJump: Dispatch<SetStateAction<number>>;
}) {
	const { sequences } = useAppSelector((state) => state.auth.profile.company);
	return (
		<>
			<Select
				placeholder="Selecciona una secuencia"
				value={selectedSequence?.id || ""}
				onValueChange={(value) =>
					setSelectedSequence(
						sequences.find((sequence) => sequence.id === value) || sequences[0],
					)
				}
			>
				{sequences.map((sequence) => (
					<SelectItem key={sequence.id} value={sequence.id}>
						{sequence.name}
					</SelectItem>
				))}
			</Select>
			<Select
				placeholder="Selecciona dia de inicio"
				value={jump.toString()}
				onValueChange={(value) => setJump(parseInt(value))}
			>
				{monthDays.map((day, i) => (
					<SelectItem key={DateToSring(day.date)} value={i.toString()}>
						{DateToSring(day.date)} - {day.day}
					</SelectItem>
				))}
			</Select>
			{selectedSequence && (
				<>
					<Text className="col-span-2 text-center my-2">Secuencia</Text>
					<div className="col-span-2 grid grid-cols-3 gap-2 place-content-center">
						{selectedSequence.steps.map(({ startTime, endTime, color }, i) => {
							const content =
								startTime === endTime
									? "Descanso"
									: `${startTime} - ${endTime}`;
							return (
								<Badge
									color={color}
									size="xs"
									className={classNames(
										selectedIndex === i + 1
											? "ring-2 ring-gray-500 ring-inset"
											: "",
										"w-full cursor-pointer",
									)}
									onClick={() => setSelectedIndex(i + 1)}
									key={`step-${startTime}-${endTime}-${i}`}
								>
									{i + 1} - {content}
								</Badge>
							);
						})}
					</div>
				</>
			)}
		</>
	);
}
