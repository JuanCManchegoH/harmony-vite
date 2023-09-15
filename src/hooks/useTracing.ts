import ExcelJS from "exceljs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Profile } from "../services/auth/types";
import { CustomerWithId } from "../services/customers/types";
import { ShiftWithId } from "../services/shifts/types";
import { StallWithId } from "../services/stalls/types";
import { WorkerWithId } from "../services/workers/types";
import { groupDates } from "../utils/dates";
import { workerSheets } from "../utils/excel";
import { getDiference } from "../utils/hours";
import { useCustomers } from "./useCustomers";
import { useStalls } from "./useStalls";
import { useWorkers } from "./useWorkers";

export function useTracing(
	profile: Profile,
	customers: CustomerWithId[],
	workers: WorkerWithId[],
	stalls: StallWithId[],
	shifts: ShiftWithId[],
) {
	const { getCustomers } = useCustomers(customers);
	const { getWorkersByIds } = useWorkers(workers);
	const { getStallsByCustomers } = useStalls(stalls, shifts);
	const month = new Date().getMonth().toString();
	const year = new Date().getFullYear().toString();
	const [selectedMonth, setSelectedMonth] = useState<string>(month);
	const [selectedYear, setSelectedYear] = useState<string>(year);

	useEffect(() => {
		profile.company.id && getCustomers();
	}, [profile]);

	useEffect(() => {
		getStallsByCustomers([selectedMonth], [selectedYear]);
	}, [selectedMonth, selectedYear]);

	useEffect(() => {
		const workersIds = shifts
			.reduce((acc, shift) => {
				if (!acc.includes(shift.worker)) {
					acc.push(shift.worker);
				}
				return acc;
			}, [] as string[])
			.filter((id) => id !== "");
		getWorkersByIds(workersIds);
	}, [shifts]);

	const groupedShifts = shifts
		.reduce((groups, shift) => {
			const workerIndex = groups.findIndex(
				(group) =>
					group[0].worker === shift.worker &&
					group[0].abbreviation === shift.abbreviation &&
					group[0].stall === shift.stall &&
					group[0].description === shift.description &&
					getDiference(group[0].startTime, group[0].endTime).str ===
						getDiference(shift.startTime, shift.endTime).str &&
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

	return {
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
		groupedShifts,
	};
}

export function useExcel(
	groupedShifts: ShiftWithId[][],
	customers: CustomerWithId[],
	workers: WorkerWithId[],
	stalls: StallWithId[],
) {
	async function generateExcel() {
		const workbook = new ExcelJS.Workbook();
		workerSheets.forEach((sheet) => {
			const worksheet = workbook.addWorksheet(sheet.name);
			const header = sheet.headers;
			const shifts = groupedShifts.filter(
				(shift) => shift[0].color === sheet.color,
			);
			const headerRow = worksheet.addRow(header);
			headerRow.eachCell((cell) => {
				cell.font = { bold: true };
			});
			// Freeze first row
			worksheet.views = [{ state: "frozen", ySplit: 1 }];
			header.forEach((_, i) => {
				if (i > 0 && i < 5) {
					worksheet.getColumn(i + 1).width = 40;
				}
				if (i > 6) {
					worksheet.getColumn(i + 1).width = 40;
				}
			});

			shifts.forEach((shifts, i) => {
				const stall = stalls.find((stall) => stall.id === shifts[0].stall);
				const customer = customers.find(
					(customer) => customer.id === shifts[0].stall,
				);
				const worker = workers.find((worker) => worker.id === shifts[0].worker);
				const position =
					shifts[0].position ||
					stall?.workers.find((worker) => worker.id === shifts[0].worker)
						?.position;
				const row = [
					i + 1,
					shifts[0].workerName,
					worker?.identification || "-",
					position || "-",
					groupDates(shifts.map((shift) => shift.day)).join(" | "),
					shifts[0].abbreviation,
					shifts.reduce(
						(acc, shift) =>
							acc + getDiference(shift.startTime, shift.endTime).hours,
						0,
					) || "-",
					stall?.customerName || customer?.name,
					stall?.branch || "-",
					shifts[0].stallName !== stall?.name ? "-" : shifts[0].stallName,
					shifts[0].sequence || "-",
					shifts[0].description || "-",
				];
				worksheet.addRow(row);
			});
		});
		await workbook.xlsx.writeBuffer();
		// Download the file
		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.setAttribute("hidden", "");
			a.setAttribute("href", url);
			a.setAttribute("download", "Listado personal.xlsx");
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	}

	return { generateExcel };
}

export interface TracingData {
	selectedMonth: string;
	setSelectedMonth: Dispatch<SetStateAction<string>>;
	selectedYear: string;
	setSelectedYear: Dispatch<SetStateAction<string>>;
}
