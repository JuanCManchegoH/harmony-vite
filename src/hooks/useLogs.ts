import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { setLoading, setLogs } from "../services/appLogs/slice";
import { Log } from "../services/appLogs/types";
import { useAppDispatch } from "./store";

export const useLogs = (logs: Log[]) => {
	const dispatch = useAppDispatch();
	const month = new Date().getMonth().toString();
	const year = new Date().getFullYear().toString();
	const [selectedMonth, setSelectedMonth] = useState<string>(month);
	const [selectedYear, setSelectedYear] = useState<string>(year);

	// filters
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const types = logs.map((log) => log.type);
	const uniqueTypes = [...new Set(types)];
	useEffect(() => {
		setSelectedTypes(uniqueTypes);
	}, [logs]);

	const getLogs = async () => {
		dispatch(setLoading(true));
		const month =
			selectedMonth.length === 1
				? `0${Number(selectedMonth) + 1}`
				: selectedMonth;
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.get<Log[]>(
				api.logs.getByMonthAndYear(month, selectedYear),
			);
			dispatch(setLogs(data));
			toast.success("Registros obtenidos");
		} catch {
			toast.error("Error al obtener registros");
		} finally {
			dispatch(setLoading(false));
		}
	};

	return {
		getLogs,
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
		selectedTypes,
		setSelectedTypes,
		uniqueTypes,
	};
};
