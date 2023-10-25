import ExcelJS from "exceljs";
import { Convention } from "../services/company/types";
import { ShiftWithId } from "../services/shifts/types";

export interface DescriptionWithDates {
	description: string;
	dates: string[];
}

export interface SequenceWithStallNames {
	name: string;
	stallNames: string[];
}

export const groupDescriptions = (shifts: ShiftWithId[]) => {
	return shifts.reduce((acc: DescriptionWithDates[], { description, day }) => {
		const existingDescription = acc.find(
			(item) => item.description === description,
		);

		if (existingDescription) {
			existingDescription.dates.push(day.slice(0, 5));
		} else {
			acc.push({
				description,
				dates: [day.slice(0, 5)],
			});
		}

		return acc;
	}, []);
};

export const groupSequences = (names: { name: string; stallName: string }[]) =>
	names.reduce((acc: SequenceWithStallNames[], { name, stallName }) => {
		const existingSequence = acc.find((item) => item.name === name);

		if (existingSequence) {
			if (!existingSequence.stallNames.includes(stallName))
				existingSequence.stallNames.push(stallName);
		} else {
			acc.push({
				name,
				stallNames: [stallName],
			});
		}

		return acc;
	}, []);

export const groupShiftsByColor = (shifts: ShiftWithId[]) =>
	shifts.reduce(
		(acc, shift) => {
			if (shift.color === "green") acc.green.push(shift);
			if (shift.color === "gray") acc.gray.push(shift);
			if (shift.color === "yellow") acc.yellow.push(shift);
			if (shift.color === "red") acc.red.push(shift);
			if (shift.color === "sky") acc.sky.push(shift);
			return acc;
		},
		{
			green: [] as ShiftWithId[],
			gray: [] as ShiftWithId[],
			yellow: [] as ShiftWithId[],
			red: [] as ShiftWithId[],
			sky: [] as ShiftWithId[],
		},
	);

export const headerData = (
	customersheet: ExcelJS.Worksheet,
	conventions: Convention[],
) => {
	const header = [
		"No.",
		"PUESTO",
		"NOMBRE",
		"CARGO",
		"IDENTIFICACION",
		"DIAS LABORADOS / 30",
		"TURNOS",
		"DESCANSOS",
		"ADICIONALES",
		...conventions.map((convention) => convention.name),
		"SECUECIA",
		"OVSERVACIONES",
	];
	header.forEach((_, i) => {
		if (i === 0) customersheet.getColumn(i + 1).width = 5;
		if (i === 2) customersheet.getColumn(i + 1).width = 40;
		if (i <= 5 && i !== 0 && i !== 2) customersheet.getColumn(i + 1).width = 30;
		if (i >= 6 && i !== header.length - 1)
			customersheet.getColumn(i + 1).width = 15;
		if (i === header.length - 1) customersheet.getColumn(i + 1).width = 50;
	});

	return header;
};
