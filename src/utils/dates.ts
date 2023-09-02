import { format, getDaysInMonth } from "date-fns";
import { holidays } from "./holidays";
export interface MonthDay {
	day: string;
	date: Date;
	isHoliday: boolean;
}

export type weekDay =
	| "sunday"
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday";

export const weekDays = {
	sunday: "Domingo",
	monday: "Lunes",
	tuesday: "Martes",
	wednesday: "Miércoles",
	thursday: "Jueves",
	friday: "Viernes",
	saturday: "Sábado",
};

const months = [
	{ name: "Enero", value: "0" },
	{ name: "Febrero", value: "1" },
	{ name: "Marzo", value: "2" },
	{ name: "Abril", value: "3" },
	{ name: "Mayo", value: "4" },
	{ name: "Junio", value: "5" },
	{ name: "Julio", value: "6" },
	{ name: "Agosto", value: "7" },
	{ name: "Septiembre", value: "8" },
	{ name: "Octubre", value: "9" },
	{ name: "Noviembre", value: "10" },
	{ name: "Diciembre", value: "11" },
];
const years = [
	{ name: "2021", value: "2021" },
	{ name: "2022", value: "2022" },
	{ name: "2023", value: "2023" },
	{ name: "2024", value: "2024" },
	{ name: "2025", value: "2025" },
	{ name: "2026", value: "2026" },
	{ name: "2027", value: "2027" },
];

const getDays = (month: string, year: string) => {
	const days: MonthDay[] = [];
	const daysInMonth = getDaysInMonth(
		new Date(Number(year), parseInt(month), 1),
	);
	for (let i = 1; i <= daysInMonth; i++) {
		const date = new Date(Number(year), parseInt(month), i);
		const day = format(date, "EEEE").toLowerCase();
		const isHoliday = holidays.includes(format(date, "dd/MM/yyyy"));
		days.push({
			day: weekDays[day as weekDay],
			isHoliday,
			date,
		});
	}
	return days;
};

const getDay = (date: Date) => {
	return format(date, "dd");
};

const DateToSring = (date: Date) => {
	return format(date, "dd/MM/yyyy");
};

const StringToDate = (date: string) => {
	const [day, month, year] = date.split("/");
	return new Date(Number(year), Number(month) - 1, Number(day));
};

export { DateToSring, StringToDate, getDay, getDays, months, years };
