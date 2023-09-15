import ExcelJS from "exceljs";
import { CustomerWithId } from "../services/customers/types";
import { ShiftWithId } from "../services/shifts/types";
import { StallWithId } from "../services/stalls/types";
import { groupDates } from "../utils/dates";
import { workerSheets } from "../utils/excel";
import { getDiference } from "../utils/hours";

export function useExcel(
	groupedShifts: ShiftWithId[][],
	customers: CustomerWithId[],
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

			shifts.forEach((shifts, i) => {
				const stall = stalls.find((stall) => stall.id === shifts[0].stall);
				const customer = customers.find(
					(customer) => customer.id === shifts[0].stall,
				);
				const position =
					shifts[0].position ||
					stall?.workers.find((worker) => worker.id === shifts[0].worker)
						?.position;
				const row = [
					i + 1,
					shifts[0].workerName,
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
		// fit columns
		workbook.worksheets.forEach((worksheet) => {
			worksheet.columns.forEach((column) => {
				let maxLength = 0;
				column.eachCell((cell) => {
					const columnLength = cell.value ? cell.value.toString().length : 0;
					if (columnLength > maxLength) {
						maxLength = columnLength;
					}
				});
				column.width = maxLength < 10 ? 10 : maxLength;
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
