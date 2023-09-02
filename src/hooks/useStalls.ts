import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { CustomerWithId } from "../services/customers/types";
import { setShifts } from "../services/shifts/slice";
import { setLoading, setStalls } from "../services/stalls/slice";
import {
	HandleStallWorker,
	StallWithId,
	StallsAndShifts,
} from "../services/stalls/types";
import { useAppDispatch } from "./store";

export interface GetStalls {
	months: string[];
	years: string[];
	customerId: string;
}

export const useStalls = (stalls: StallWithId[]) => {
	const dispatch = useAppDispatch();

	async function createStall(stall: StallData) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<StallWithId>(api.stalls.create, stall);
			toast.success("Puesto creado");
			dispatch(setStalls([...stalls, data]));
			return data;
			// console.log error
		} catch (error) {
			console.log(error);
			toast.error("Error Creando puesto");
		}
	}

	async function getStallsByCustomer(getStalls: GetStalls) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<StallsAndShifts>(
				api.stalls.getByCustomer,
				getStalls,
			);
			dispatch(setStalls(data.stalls));
			dispatch(setShifts(data.shifts));
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
			dispatch(setStalls(stalls.map((s) => (s.id === stallId ? data : s))));
			return data;
		} catch {
			toast.error("Error actualizando puesto");
		}
	}

	async function deleteStall(
		stallId: string,
		shifts: string[],
		stalls: StallWithId[],
	) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			await axios.post(api.stalls.delete(stallId), { shifts });
			toast.success("Puesto eliminado");
			dispatch(setStalls(stalls.filter((s) => s.id !== stallId)));
		} catch {
			toast.error("Error eliminando puesto");
		}
	}

	async function addWorker(
		stallId: string,
		worker: HandleStallWorker,
		stalls: StallWithId[],
	) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<StallWithId>(
				api.stalls.addWorker(stallId),
				worker,
			);
			toast.success("Persona agregada");
			dispatch(setStalls(stalls.map((s) => (s.id === stallId ? data : s))));
			return data;
		} catch {
			toast.error("Error agregando persona");
		}
	}

	async function removeWorker(
		stallId: string,
		workerId: string,
		stalls: StallWithId[],
	) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.delete<StallWithId>(
				api.stalls.removeWorker(stallId, workerId),
			);
			toast.success("Persona eliminada");
			dispatch(setStalls(stalls.map((s) => (s.id === stallId ? data : s))));
			return data;
		} catch {
			toast.error("Error eliminando persona");
		}
	}

	return {
		createStall,
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
	});
	const resetCreateStallData = () => {
		setStallData({
			name: "",
			description: "",
			ays: "",
			branch: "",
			stage: 0,
		});
	};

	const handleCreateStall = (
		createStall: (data: StallData) => Promise<StallWithId | undefined>,
	) => {
		if (!stallData.name || !stallData.description || !stallData.ays) {
			return toast.error("Todos los campos con * son obligatorios");
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
			return toast.error("Todos los campos con * son obligatorios");
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

export interface StallData {
	name: string;
	description: string;
	ays: string;
	branch: string;
	stage: number;
}
