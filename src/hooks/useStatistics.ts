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
import { Profile } from "../services/auth/types";
import { Position } from "../services/company/types";
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
import { useAppDispatch } from "./store";
import { useCustomers } from "./useCustomers";

export const statisticsSecs = [
	{ title: "Programaciones", icon: CalendarDaysIcon },
	{ title: "Personal", icon: IdentificationIcon },
];

export default function useStatistics(
	groups: ShiftWithId[][],
	profile: Profile,
	customers: CustomerWithId[],
	stalls: StallWithId[],
) {
	const dispatch = useAppDispatch();
	const { getCustomers } = useCustomers(customers);
	const month = new Date().getMonth().toString();
	const year = new Date().getFullYear().toString();
	const [section, setSection] = useState(statisticsSecs[0].title);
	const [selectedMonth, setSelectedMonth] = useState<string>(month);
	const [selectedYear, setSelectedYear] = useState<string>(year);
	const [pages, setPages] = useState(1);

	// Filters
	const [abbsList, setAbbsList] = useState<string[]>([]);
	const [positionsList, setPositionsList] = useState<string[]>([]);
	const [selectedAbbreviations, setSelectedAbbreviations] = useState<string[]>(
		[],
	);
	const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
	const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

	const groupedShifts = (shifts: ShiftWithId[]) =>
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
					const getAbbsList = getGroupedShifts.reduce((acc, group) => {
						if (acc.includes(group[0].abbreviation)) return acc;
						else return [...acc, group[0].abbreviation];
					}, [] as string[]);
					// group[0].position
					const getFirstPositionsList = getGroupedShifts.reduce(
						(acc, group) => {
							if (!group[0].position || acc.includes(group[0].position))
								return acc;
							else return [...acc, group[0].position];
						},
						[] as string[],
					);
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
		profile.company.id && getCustomers();
	}, [profile]);

	useEffect(() => {
		console.log(positionsList);
	}, [positionsList]);

	useEffect(() => {
		getStadistics();
	}, [selectedMonth, selectedYear]);

	useEffect(() => {
		setSelectedCustomers(customers.map((customer) => customer.name));
	}, [customers]);

	const stallWorkers = stalls.reduce(
		(acc, stall) => [...acc, ...stall.workers],
		[] as StallWithId["workers"],
	);
	useEffect(() => {
		const filteredGroups = groups.filter((group) => {
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
		});

		const groupsToShow = filteredGroups.slice((pages - 1) * 100, pages * 100);
		dispatch(setGroupsToShow(groupsToShow));
		dispatch(setGroupedShiftsLength(filteredGroups.length));
	}, [pages, selectedAbbreviations, selectedPositions, selectedCustomers]);

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
		},
		// Excel
		excelGroups: groups.filter((group) => {
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
		const workerSheets = [
			...customers.map((customer) => ({
				name: customer.name,
				id: customer.id,
			})),
		];
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

		workerSheets.forEach((sheet) => {
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

				// get workers outside the stall but
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

				// for each worker add a row, and add the shifts of the worker, then add an empty row
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
