import ExcelJS from "exceljs";
import { hours } from "../components/Statistics/WorkersList";
import { Convention } from "../services/company/types";
import { ShiftWithId } from "../services/shifts/types";
import { StallWorker } from "../services/stalls/types";

export interface DescriptionWithDates {
	description: string;
	dates: string[];
}

export interface SequenceWithStallNames {
	name: string;
	stallNames: string[];
}

export const groupedShiftsExtended = (shifts: ShiftWithId[]) =>
	shifts
		.reduce((groups, shift) => {
			const workerIndex = groups.findIndex(
				(group) =>
					group[0].worker === shift.worker &&
					group[0].abbreviation === shift.abbreviation &&
					group[0].stall === shift.stall &&
					group[0].description.trim() === shift.description.trim() &&
					group[0].position === shift.position &&
					group[0].sequence === shift.sequence &&
					group[0].type === shift.type,
			);
			if (workerIndex === -1) {
				groups.push([shift]);
			} else {
				groups[workerIndex].push(shift);
			}
			return groups;
		}, [] as ShiftWithId[][])
		.sort((a, b) => {
			if (a[0].worker > b[0].worker) return 1;
			if (a[0].worker < b[0].worker) return -1;

			return 0;
		});

export const filteredGroups = (
	groups: ShiftWithId[][],
	selectedAbbreviations: string[],
	selectedPositions: string[],
	selectedCustomers: string[],
	minHours: number,
	stallWorkers: StallWorker[],
) =>
	groups.filter((group) => {
		const green = hours(group.filter((s) => s.color === "green"));
		const yellow = hours(group.filter((s) => s.color === "yellow"));
		const red = hours(group.filter((s) => s.color === "red"));
		const sky = hours(group.filter((s) => s.color === "sky"));
		const abbreviationMatch = group.some((item) =>
			selectedAbbreviations.includes(item.abbreviation),
		);
		const positionMatch = group.every((item) => {
			const itemPosition = item.position;
			if (selectedPositions.includes(itemPosition)) return true;
			return stallWorkers.some((worker) => {
				return (
					worker.id === item.worker &&
					selectedPositions.includes(worker.position)
				);
			});
		});
		const customerMatch = group.every((item) =>
			selectedCustomers.includes(item.customerName),
		);
		const minMatch = green + yellow - red - sky >= minHours;
		return abbreviationMatch && positionMatch && customerMatch && minMatch;
	});

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
