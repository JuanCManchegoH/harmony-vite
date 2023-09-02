import { Select, SelectItem } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import Calendar from "../../../common/Calendar";
import Label from "../../../common/Label";
import SelectHours, { Times } from "../../../common/SelectHours";
import { useAppSelector } from "../../../hooks/store";
import { Convention } from "../../../services/company/types";
import { MonthDay } from "../../../utils/dates";

export default function SecondStep({
	selectedConvention,
	setSelectedConvention,
	monthDays,
	selectedDays,
	setSelectedDays,
	isShift,
	setIsShift,
	times,
	setTimes,
}: {
	selectedConvention: Convention | undefined;
	setSelectedConvention: Dispatch<SetStateAction<Convention | undefined>>;
	monthDays: MonthDay[];
	selectedDays: string[];
	setSelectedDays: Dispatch<SetStateAction<string[]>>;
	isShift: boolean;
	setIsShift: Dispatch<SetStateAction<boolean>>;
	times: Times;
	setTimes: Dispatch<SetStateAction<Times>>;
}) {
	const { conventions } = useAppSelector((state) => state.auth.profile.company);
	return (
		<>
			<Calendar
				monthDays={monthDays}
				selectedDays={selectedDays}
				setSelectedDays={setSelectedDays}
			/>
			<form className="grid grid-cols-2 gap-2">
				<Label text="Convención">
					<Select
						className="col-span-2"
						placeholder="Convención"
						value={selectedConvention?.id}
						disabled={conventions.length === 0 || !isShift}
						onValueChange={(value) =>
							setSelectedConvention(
								conventions.find((convention) => convention.id === value),
							)
						}
					>
						{conventions.map((convention) => (
							<SelectItem key={convention.id} value={convention.id}>
								{convention.name}
							</SelectItem>
						))}
					</Select>
				</Label>
				<SelectHours
					times={times}
					setTimes={setTimes}
					isShift={isShift}
					setIsShift={setIsShift}
				/>
			</form>
		</>
	);
}
