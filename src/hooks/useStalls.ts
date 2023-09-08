import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { CustomerWithId } from "../services/customers/types";
import { setPlansShifts, setTracingShifts } from "../services/shifts/slice";
import { ShiftWithId } from "../services/shifts/types";
import {
	setLoading,
	setPlansStalls,
	setTracingStalls,
} from "../services/stalls/slice";
import {
	HandleStallWorker,
	StallWithId,
	StallsAndShifts,
} from "../services/stalls/types";
import { WorkerWithId } from "../services/workers/types";
import { useAppDispatch } from "./store";

export interface GetStalls {
	months: string[];
	years: string[];
	customerId?: string;
}

export const useStalls = (stalls: StallWithId[], shifts: ShiftWithId[]) => {
	const dispatch = useAppDispatch();

	async function createStall(stall: StallData) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<StallWithId>(api.stalls.create, stall);
			toast.success("Puesto creado");
			dispatch(setPlansStalls([...stalls, data]));
			return data;
		} catch (error) {
			console.log(error);
			toast.error("Error Creando puesto");
		}
	}

	async function getStallsByCustomer(
		months: string[],
		years: string[],
		customerId: string,
	) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<StallsAndShifts>(
				api.stalls.getByCustomer,
				{ months, years, customerId },
			);
			dispatch(setPlansStalls(data.stalls));
			dispatch(setPlansShifts(data.shifts));
			return data;
		} catch {
			toast.error("Error obteniendo puestos");
		}
	}

	async function getStallsByCustomers(months: string[], years: string[]) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<StallsAndShifts>(
				api.stalls.getByCustomers,
				{ months, years },
			);
			dispatch(setTracingStalls(data.stalls));
			dispatch(setTracingShifts(data.shifts));
			return data;
		} catch {
			toast.error("Error obteniendo puestos");
		}
	}

	async function updateStall(stall: StallData, stallId: string) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<StallWithId>(
				api.stalls.update(stallId),
				stall,
			);
			toast.success("Puesto actualizado");
			dispatch(
				setPlansStalls(stalls.map((s) => (s.id === stallId ? data : s))),
			);
			return data;
		} catch {
			toast.error("Error actualizando puesto");
		}
	}

	async function deleteStall(
		stallId: string,
		stallShifts: string[],
		stalls: StallWithId[],
	) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			await axios.post(api.stalls.delete(stallId), { shifts: stallShifts });
			toast.success("Puesto eliminado");
			dispatch(setPlansStalls(stalls.filter((s) => s.id !== stallId)));
			dispatch(
				setPlansShifts(
					shifts.filter((shift) => !stallShifts.includes(shift.id as string)),
				),
			);
		} catch {
			toast.error("Error eliminando puesto");
		}
	}

	async function addWorker(stallId: string, worker: HandleStallWorker) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<StallWithId>(
				api.stalls.addWorker(stallId),
				worker,
			);
			toast.success("Persona agregada");
			dispatch(
				setPlansStalls(stalls.map((s) => (s.id === stallId ? data : s))),
			);
			return data;
		} catch {
			toast.error("Error agregando persona");
		}
	}

	async function removeWorker(
		stallId: string,
		workerId: string,
		workerShifts: string[],
	) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<StallWithId>(
				api.stalls.removeWorker(stallId, workerId),
				{ shifts: workerShifts },
			);
			toast.success("Persona eliminada");
			dispatch(
				setPlansStalls(stalls.map((s) => (s.id === stallId ? data : s))),
			);
			dispatch(
				setPlansShifts(
					shifts.filter((shift) => !workerShifts.includes(shift.id as string)),
				),
			);
			return data;
		} catch {
			toast.error("Error eliminando persona");
		}
	}

	return {
		createStall,
		getStallsByCustomers,
		getStallsByCustomer,
		updateStall,
		deleteStall,
		addWorker,
		removeWorker,
	};
};

export const useHandleStall = (
	selectedMonth: string,
	selectedYear: string,
	actualCustomer: CustomerWithId | undefined,
	stall?: StallWithId,
) => {
	const [stallData, setStallData] = useState<StallData>({
		name: stall?.name || "",
		description: stall?.description || "",
		ays: stall?.ays || "",
		branch: stall?.branch || "",
		stage: 0,
		tag: stall?.tag || "",
	});
	const resetCreateStallData = () => {
		setStallData({
			name: "",
			description: "",
			ays: "",
			branch: "",
			stage: 0,
			tag: "",
		});
	};

	const handleCreateStall = (
		createStall: (data: StallData) => Promise<StallWithId | undefined>,
	) => {
		if (!stallData.name || !stallData.description || !stallData.ays) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		const data = {
			...stallData,
			month: selectedMonth,
			year: selectedYear,
			customer: actualCustomer?.id || "",
			customerName: actualCustomer?.name || "",
			workers: [],
			stage: 0,
		};
		createStall(data).then((res) => {
			if (res) {
				resetCreateStallData();
			}
		});
	};

	const handleUpdateStall = (
		updateStall: (
			data: StallData,
			stallId: string,
		) => Promise<StallWithId | undefined>,
		id: string,
	) => {
		if (!stallData.name || !stallData.description || !stallData.ays) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		updateStall(stallData, id);
	};
	return {
		stallData,
		setStallData,
		handleCreateStall,
		handleUpdateStall,
	};
};

export const useHandleStallWorker = () => {
	const [selectedWorker, setSelectedWorker] = useState<
		WorkerWithId | undefined
	>(undefined);
	const [position, setPosition] = useState("");

	const handleAddWorker = (
		addWorker: (
			stallId: string,
			worker: HandleStallWorker,
		) => Promise<StallWithId | undefined>,
		stallId: string,
	) => {
		if (!position)
			return toast.message("Datos incompletos", {
				description: "Seleccione un cargo",
			});
		if (!selectedWorker)
			return toast.message("Datos incompletos", {
				description: "Seleccione una persona",
			});
		const data = {
			id: selectedWorker.id,
			name: selectedWorker.name,
			identification: selectedWorker.identification,
			position,
			sequence: [],
			index: 0,
			jump: 0,
		};
		addWorker(stallId, data).then((res) => {
			if (res) {
				setSelectedWorker(undefined);
			}
		});
	};

	return {
		selectedWorker,
		setSelectedWorker,
		position,
		setPosition,
		handleAddWorker,
	};
};

export interface StallData {
	name: string;
	description: string;
	ays: string;
	branch: string;
	stage: number;
	tag: string;
}
