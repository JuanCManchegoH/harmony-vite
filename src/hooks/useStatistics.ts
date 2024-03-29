import {
	CalendarDaysIcon,
	IdentificationIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import ExcelJS from "exceljs";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { Convention, Position, Sequence } from "../services/company/types";
import { CustomerWithId } from "../services/customers/types";
import { ShiftWithId } from "../services/shifts/types";
import { StallWithId } from "../services/stalls/types";
import {
	setGroupedShifts,
	setGroupedShiftsLength,
	setGroupsToShow,
	setStatisticsShifts,
	setStatisticsStalls,
} from "../services/statistics/slice";
import { WorkerWithId } from "../services/workers/types";
import { DateToSring, MonthDay, groupDates } from "../utils/dates";
import { workerSheets } from "../utils/excel";
import formatCurrency from "../utils/formatCurrency";
import { getDiference } from "../utils/hours";
import {
	filteredGroups,
	groupDescriptions,
	groupSequences,
	groupShiftsByColor,
	groupedShiftsExtended,
	headerData,
} from "../utils/statistics";
import { useAppDispatch } from "./store";

export const statisticsSecs = [
	{ title: "Programaciones", icon: CalendarDaysIcon },
	{ title: "Personal", icon: IdentificationIcon },
];

export default function useStatistics(
	groups: ShiftWithId[][],
	customers: CustomerWithId[],
	stalls: StallWithId[],
	tabIndex: number,
) {
	const dispatch = useAppDispatch();
	const month = new Date().getMonth().toString();
	const year = new Date().getFullYear().toString();
	const [section, setSection] = useState(statisticsSecs[0].title);
	const [selectedMonth, setSelectedMonth] = useState<string>(month);
	const [selectedYear, setSelectedYear] = useState<string>(year);
	const [pages, setPages] = useState(1);

	// Filters
	const [abbsList, setAbbsList] = useState<string[]>([]);
	const [minHours, setMinHours] = useState<number>(0);
	const [positionsList, setPositionsList] = useState<string[]>([]);
	const [selectedAbbreviations, setSelectedAbbreviations] = useState<string[]>(
		[],
	);
	const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
	const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

	// CalendarFilters
	const [selectedCCustomers, setSelectedCCustomers] = useState<string[]>([]);

	const groupedShifts = (shifts: ShiftWithId[]) =>
		shifts
			.reduce((groups, shift) => {
				const workerIndex = groups.findIndex(
					(group) => group[0].worker === shift.worker,
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

	async function getStadistics() {
		const types = ["shift", "rest", "event", "customer"];
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const getStallsPromise = axios.post<StallWithId[]>(
				api.stalls.getByMonthsAndYears,
				{
					months: [selectedMonth],
					years: [selectedYear],
				},
			);
			const getShiftsPromise = axios.post<ShiftWithId[]>(
				api.shifts.getByMonthsAndYears,
				{
					months: [selectedMonth],
					years: [selectedYear],
					types,
				},
			);
			await toast.promise(Promise.all([getStallsPromise, getShiftsPromise]), {
				loading: "Cargando estadísticas",
				success: ([stalls, shifts]) => {
					const getGroupedShifts = groupedShifts(shifts.data);
					console.log(stalls);
					dispatch(setStatisticsStalls(stalls.data));
					dispatch(setStatisticsShifts(shifts.data));
					dispatch(setGroupedShifts(getGroupedShifts));
					dispatch(setGroupedShiftsLength(getGroupedShifts.length));
					dispatch(
						setGroupsToShow(
							getGroupedShifts.slice((pages - 1) * 100, pages * 100),
						),
					);
					const getAbbsList = shifts.data.reduce((acc, shift) => {
						if (acc.includes(shift.abbreviation)) return acc;
						else return [...acc, shift.abbreviation];
					}, [] as string[]);

					const getFirstPositionsList = shifts.data.reduce((acc, shift) => {
						if (!shift.position || acc.includes(shift.position)) return acc;
						else return [...acc, shift.position];
					}, [] as string[]);
					// stalls.workers.position
					const getSecondPositionsList = stalls.data.reduce(
						(acc, stall) => [
							...acc,
							...stall.workers.reduce((acc, worker) => {
								if (acc.includes(worker.position)) return acc;
								else return [...acc, worker.position];
							}, [] as string[]),
						],
						[] as string[],
					);
					// dont repeat positions
					const getPositionsList = [
						...getFirstPositionsList,
						...getSecondPositionsList,
					].reduce((acc, position) => {
						if (acc.includes(position)) return acc;
						else return [...acc, position];
					}, [] as string[]);

					setAbbsList(getAbbsList);
					setSelectedAbbreviations(getAbbsList);
					setPositionsList(getPositionsList);
					setSelectedPositions(getPositionsList);
					return "Estadísticas cargadas";
				},
				error: "Error cargando estadísticas",
			});
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		tabIndex === 2 && getStadistics();
	}, [selectedMonth, selectedYear, tabIndex]);

	useEffect(() => {
		setSelectedCustomers(customers.map((customer) => customer.name));
		setSelectedCCustomers(customers.map((customer) => customer.id));
	}, [customers]);

	const stallWorkers = stalls.reduce(
		(acc, stall) => [...acc, ...stall.workers],
		[] as StallWithId["workers"],
	);
	useEffect(() => {
		const filtered = filteredGroups(
			groups,
			selectedAbbreviations,
			selectedPositions,
			selectedCustomers,
			minHours,
			stallWorkers,
		);

		const groupsToShow = filtered.slice((pages - 1) * 100, pages * 100);
		dispatch(setGroupsToShow(groupsToShow));
		dispatch(setGroupedShiftsLength(filtered.length));
	}, [
		pages,
		selectedAbbreviations,
		selectedPositions,
		selectedCustomers,
		minHours,
	]);

	return {
		section,
		setSection,
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
		getStadistics,
		pages,
		setPages,
		// Filters
		filters: {
			abbsList,
			selectedAbbreviations,
			setSelectedAbbreviations,
			positionsList,
			selectedPositions,
			setSelectedPositions,
			selectedCustomers,
			setSelectedCustomers,
			minHours,
			setMinHours,
		},
		// CalendarFilters
		calendarFilters: {
			selectedCCustomers,
			setSelectedCCustomers,
		},
		// Excel
		excelGroups: groupedShiftsExtended(groups.flat()).filter((group) => {
			const abbreviationMatch = selectedAbbreviations.includes(
				group[0].abbreviation,
			);
			const positionMatch =
				selectedPositions.includes(group[0].position) ||
				stallWorkers.some(
					(worker) =>
						worker.id === group[0].worker &&
						selectedPositions.includes(worker.position),
				);
			const customerMatch = selectedCustomers.includes(group[0].customerName);
			return abbreviationMatch && positionMatch && customerMatch;
		}),
	};
}

export function useExcel(
	positions: Position[],
	groupedShifts: ShiftWithId[][],
	customers: CustomerWithId[],
	stalls: StallWithId[],
	year: string,
) {
	async function generateExcel() {
		const workbook = new ExcelJS.Workbook();
		const access_token = Cookie.get("access_token");
		axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
		const workersIds = groupedShifts
			.reduce((acc, group) => {
				if (!acc.includes(group[0].worker)) {
					acc.push(group[0].worker);
				}
				return acc;
			}, [] as string[])
			.filter((id) => id !== "");
		const { data } = await axios.post<WorkerWithId[]>(api.workers.getByIds, {
			ids: workersIds,
		});
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
				const hours = shifts.reduce(
					(acc, shift) =>
						acc + getDiference(shift.startTime, shift.endTime).hours,
					0,
				);
				const worker = data.find((worker) => worker.id === shifts[0].worker);
				const position =
					shifts[0].position ||
					stall?.workers.find((worker) => worker.id === shifts[0].worker)
						?.position;

				const positionValue =
					position &&
					positions.find((p) => p.name === position && String(p.year) === year)
						?.value;
				const row = [
					i + 1, // index
					shifts[0].workerName, // name
					worker?.identification || "-", // identification
					position || "-", // position
					shifts.length, // quantity
					groupDates(shifts.map((shift) => shift.day)).join(" | "), // dates
					shifts[0].abbreviation, // type
					hours || "-", // hours
					stall?.customerName || customer?.name, // customer
					stall?.branch || "-", // branch
					shifts[0].stallName !== stall?.name ? "-" : shifts[0].stallName,
					shifts[0].sequence || "-", // sequence
					positionValue && shifts[0].color === "yellow"
						? `${formatCurrency(positionValue * hours)}`
						: "-", // value
					shifts[0].description || "-", // description
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

export function useCalendarExcel(
	customers: CustomerWithId[],
	stalls: StallWithId[],
	shifts: ShiftWithId[],
	monthDays: MonthDay[],
) {
	async function generateCalendarExcel() {
		const customerSheets = [...customers.map(({ id, name }) => ({ id, name }))];
		const headers = [
			"Sede",
			"Puesto",
			"Nombre",
			"Identificacion",
			"Cargo",
			...monthDays.map((day) => DateToSring(day.date).slice(0, 5)),
		];
		const workbook = new ExcelJS.Workbook();
		const access_token = Cookie.get("access_token");
		axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
		const workersIds = shifts
			.reduce((acc, shift) => {
				if (!acc.includes(shift.worker)) {
					acc.push(shift.worker);
				}
				return acc;
			}, [] as string[])
			.filter((id) => id !== "");
		const { data } = await axios.post<WorkerWithId[]>(api.workers.getByIds, {
			ids: workersIds,
		});

		customerSheets.forEach((sheet) => {
			const worksheet = workbook.addWorksheet(sheet.name);
			const header = headers;
			const customerStalls = stalls.filter(
				(stall) => stall.customer === sheet.id,
			);
			const headerRow = worksheet.addRow(header);
			headerRow.eachCell((cell) => {
				cell.font = { bold: true };
			});
			// Freeze first row
			worksheet.views = [{ state: "frozen", ySplit: 1 }];
			header.forEach((_, i) => {
				if (i < 5) {
					worksheet.getColumn(i + 1).width = 40;
				}
				if (i >= 5) {
					worksheet.getColumn(i + 1).width = 15;
				}
			});

			customerStalls.forEach((s) => {
				const stallShifts = shifts.filter(
					(shift) => shift.customer === sheet.id && shift.stall === s.id,
				);
				const insideWorkers = s.workers;

				const outsideWorkers = stallShifts
					.filter((s) => s.color === "green" || s.color === "gray")
					.reduce(
						(acc, shift) => {
							const isInside = insideWorkers.some(
								(worker) => worker.id === shift.worker,
							);
							const existingWorker = acc.find(
								(worker) => worker.id === shift.worker,
							);
							if (!isInside && !existingWorker) {
								const worker = data.find(
									(worker) => worker.id === shift.worker,
								);
								acc.push({
									id: shift.worker,
									name: shift.workerName,
									identification: worker?.identification || "-",
									position: shift.position || "-",
									shifts: [shift],
								});
							}
							if (!isInside && existingWorker) {
								existingWorker.shifts.push(shift);
							}
							return acc;
						},
						[] as {
							id: string;
							name: string;
							identification: string;
							position: string;
							shifts: ShiftWithId[];
						}[],
					);

				insideWorkers.forEach((worker) => {
					const workerShifts = stallShifts.filter(
						(shift) => shift.worker === worker.id,
					);
					const row = [
						s.branch || "-",
						s.name,
						worker.name,
						worker.identification,
						worker.position,
						...monthDays.map((day) => {
							const shift = workerShifts.find(
								(shift) => shift.day === DateToSring(day.date),
							);
							return shift ? `${shift.startTime} - ${shift.endTime}` : "-";
						}),
					];
					worksheet.addRow(row);
				});

				outsideWorkers.forEach((worker) => {
					const row = [
						s.branch || "-",
						s.name,
						worker.name,
						worker.identification,
						worker.position,
						...monthDays.map((day) => {
							const shift = worker.shifts.filter(
								(shift) => shift.day === DateToSring(day.date),
							);
							//  return start - end for each shift separated by a comma
							return shift.length
								? shift.map((s) => `${s.startTime} - ${s.endTime}`).join(", ")
								: "-";
						}),
					];
					worksheet.addRow(row);
				});

				worksheet.addRow([]);
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
			a.setAttribute("download", "Listado programaciones.xlsx");
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	}

	return { generateCalendarExcel };
}

export function useResumeExcel(
	conventions: Convention[],
	sequences: Sequence[],
	customers: CustomerWithId[],
	stalls: StallWithId[],
	shifts: ShiftWithId[],
	monthDays: MonthDay[],
) {
	async function generateResumeExcel() {
		const workbook = new ExcelJS.Workbook();
		const access_token = Cookie.get("access_token");
		axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
		const workersIds = shifts
			.reduce((acc, shift) => {
				if (!acc.includes(shift.worker)) {
					acc.push(shift.worker);
				}
				return acc;
			}, [] as string[])
			.filter((id) => id !== "");
		const { data } = await axios.post<WorkerWithId[]>(api.workers.getByIds, {
			ids: workersIds,
		});
		const customerSheets = [
			...customers.map(({ id, name, branches }) => ({ id, name, branches })),
		];

		customerSheets.forEach(({ id, name, branches }) => {
			const customersheet = workbook.addWorksheet(name);
			customersheet.addRow([]);
			const sheetHeaderText = `REPORTE ${name.toUpperCase()}`;
			const sheetHeader = customersheet.addRow([sheetHeaderText]);
			sheetHeader.getCell(1).alignment = { horizontal: "center" };
			sheetHeader.font = { bold: true, color: { argb: "FFFFFFFF" } };
			const startCell = sheetHeader.getCell(1);
			const endCell = sheetHeader.getCell(11 + conventions.length);
			customersheet.mergeCells(startCell.address, endCell.address);
			// bg only in merged cells
			for (let i = 1; i <= 11 + conventions.length; i++) {
				customersheet.getCell(sheetHeader.number, i).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FF374151" },
				};
			}
			const header = headerData(customersheet, conventions);

			customersheet.addRow([]);
			const customerStalls = stalls.filter((stall) => stall.customer === id);
			const insideWorkers = customerStalls.reduce(
				(acc, stall) => [...acc, ...stall.workers],
				[] as StallWithId["workers"],
			);
			const customerShifts = shifts.filter((shift) => shift.customer === id);
			const outsideWorkers = customerShifts.reduce(
				(acc, shift) => {
					const isInside = insideWorkers.some((worker) => {
						const workerStalls = customerStalls.filter((cs) =>
							cs.workers.some((sw) => sw.id === worker.id),
						);
						return (
							worker.id === shift.worker &&
							workerStalls.some((ws) => ws.id === shift.stall)
						);
					});
					const existingWorker = acc.find(
						(worker) => worker.id === shift.worker,
					);
					if (!isInside && !existingWorker) {
						const worker = data.find((worker) => worker.id === shift.worker);
						acc.push({
							id: shift.worker,
							name: shift.workerName,
							identification: worker?.identification || "-",
							position: shift.position || "-",
							shifts: [shift],
						});
					}
					if (!isInside && existingWorker) {
						existingWorker.shifts.push(shift);
					}
					return acc;
				},
				[] as {
					id: string;
					name: string;
					identification: string;
					position: string;
					shifts: ShiftWithId[];
				}[],
			);
			["", ...branches].forEach((branch) => {
				const branchStalls = stalls.filter(
					(stall) => stall.customer === id && branch === stall.branch,
				);
				if (!branchStalls.length) return;

				const headerText = branch ? branch : "SIN SEDE";
				const hRow = customersheet.addRow([headerText.toUpperCase()]);

				hRow.getCell(1).alignment = { horizontal: "center" };

				hRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
				const startCell = hRow.getCell(1);
				const endCell = hRow.getCell(11 + conventions.length);
				customersheet.mergeCells(startCell.address, endCell.address);

				for (let i = 1; i <= 11 + conventions.length; i++) {
					customersheet.getCell(hRow.number, i).fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: "FF374151" },
					};
				}
				const headerRow = customersheet.addRow(header);
				headerRow.font = { bold: true };
				branchStalls.forEach((s) => {
					const workers = s.workers;

					workers.forEach((worker, i) => {
						const workerShifts = shifts.filter(
							(shift) => shift.worker === worker.id && s.id === shift.stall,
						);
						const descriptionShifts = workerShifts.filter(
							(shift) =>
								shift.description !== "" &&
								shift.description !== "Turno" &&
								shift.description !== "Descanso",
						);
						const { green, gray, yellow } = groupShiftsByColor(workerShifts);

						const notWorkedDays = monthDays.filter(
							(day) =>
								![...green, ...gray].some(
									(ws) => ws.day === DateToSring(day.date),
								),
						).length;

						const basedOn30 = 30 - notWorkedDays;

						const descriptionsWithDates = groupDescriptions(descriptionShifts);
						const sequence =
							worker.sequence.length > 0
								? sequences
										.filter(
											(seq) => seq.steps.length === worker.sequence.length,
										)
										.find((seq) => {
											const steps = seq.steps.map((step) => {
												const { startTime, endTime } = step;
												return { startTime, endTime };
											});
											const workerSteps = worker.sequence.map((step) => {
												const { startTime, endTime } = step;
												return { startTime, endTime };
											});
											return (
												JSON.stringify(steps) === JSON.stringify(workerSteps)
											);
										})
								: undefined;

						const row = [
							i + 1,
							s.name,
							worker.name,
							worker.position,
							worker.identification,
							basedOn30,
							green.length,
							gray.length,
							yellow.length,
							...conventions.map((convention) => {
								const conventionShifts = workerShifts.filter(
									(shift) => shift.abbreviation === convention.abbreviation,
								);
								return conventionShifts.length;
							}),
							sequence?.name || "-",
							descriptionsWithDates
								.map(
									(description, i) =>
										`${i + 1}. ${
											description.description
										}\n(${description.dates.join(", ")})`,
								)
								.join("\n"),
						];
						customersheet.addRow(row);
					});
				});
				customersheet.addRow([]);
			});
			// OUTSIDE WORKERS
			if (outsideWorkers.length) {
				const headerText = "RELEVANTES Y NOVEDADES";
				const hRow = customersheet.addRow([headerText]);

				hRow.getCell(1).alignment = { horizontal: "center" };
				hRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
				const startCell = hRow.getCell(1);
				const endCell = hRow.getCell(11 + conventions.length);
				customersheet.mergeCells(startCell.address, endCell.address);

				for (let i = 1; i <= 11 + conventions.length; i++) {
					customersheet.getCell(hRow.number, i).fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: "FFCA8A04" },
					};
				}
				const headerRow = customersheet.addRow(header);
				headerRow.font = { bold: true };
				outsideWorkers.forEach((worker, i) => {
					const workerShifts = worker.shifts;
					const descriptionShifts = workerShifts.filter(
						(shift) =>
							shift.description !== "" &&
							shift.description !== "Turno" &&
							shift.description !== "Descanso",
					);
					const { green, gray, yellow } = groupShiftsByColor(workerShifts);

					const notWorkedDays = monthDays.filter(
						(day) =>
							![...green, ...gray].some(
								(ws) => ws.day === DateToSring(day.date),
							),
					).length;

					const stallNames = workerShifts
						.map((ws) => ws.stallName)
						.filter((sn) => sn !== name);
					const uniqueStallNames = [...new Set(stallNames)];
					const basedOn30 = 30 - notWorkedDays;

					const descriptionsWithDates = groupDescriptions(descriptionShifts);

					const row = [
						i + 1,
						uniqueStallNames.join(", "),
						worker.name,
						worker.position,
						worker.identification,
						gray.length ? basedOn30 : green.length,
						green.length,
						gray.length,
						yellow.length,
						...conventions.map((convention) => {
							const conventionShifts = workerShifts.filter(
								(shift) => shift.abbreviation === convention.abbreviation,
							);
							return conventionShifts.length;
						}),
						groupSequences(
							workerShifts.map((shift) => ({
								name: shift.sequence,
								stallName: shift.stallName,
							})),
						)
							.map(
								(sequence) =>
									`${sequence.name} (${sequence.stallNames.join(", ")})`,
							)
							.join("\n"),
						descriptionsWithDates
							.map(
								(description, i) =>
									`${i + 1}. ${
										description.description
									}\n(${description.dates.join(", ")})`,
							)
							.join("\n"),
					];
					customersheet.addRow(row);
				});
			}
		});
		// add border to all cells
		workbook.eachSheet((worksheet) => {
			worksheet.eachRow((row) => {
				row.eachCell((cell) => {
					cell.border = {
						top: { style: "thin" },
						left: { style: "thin" },
						bottom: { style: "thin" },
						right: { style: "thin" },
					};
				});
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
			a.setAttribute("download", "Reporte programaciones.xlsx");
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	}
	return { generateResumeExcel };
}
