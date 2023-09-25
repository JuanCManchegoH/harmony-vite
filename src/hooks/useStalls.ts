import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { CustomerWithId } from "../services/customers/types";
import { setShifts } from "../services/shifts/slice";
import { ShiftWithId } from "../services/shifts/types";
import { setStalls } from "../services/stalls/slice";
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

	async function createStall(stall: StallData, onSuccess?: Function) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const createStallPromise = axios.post<StallWithId>(
				api.stalls.create,
				stall,
			);

			await toast.promise(createStallPromise, {
				loading: "Creando puesto",
				success: ({ data }) => {
					dispatch(setStalls([...stalls, data]));
					onSuccess?.();
					return "Puesto creado";
				},
				error: "Error creando puesto",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function getStallsByCustomer(
		months: string[],
		years: string[],
		customerId: string,
		types: string[],
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const getStallsByCustomerPromise = axios.post<StallsAndShifts>(
				api.stalls.getByCustomer,
				{ months, years, customerId, types },
			);
			await toast.promise(getStallsByCustomerPromise, {
				loading: "Obteniendo puestos",
				success: ({ data }) => {
					dispatch(setStalls(data.stalls));
					dispatch(setShifts(data.shifts));
					onSuccess?.();
					return "Puestos obtenidos";
				},
				error: "Error obteniendo puestos",
			});
		} catch (error) {
			console.log(error);
		}
	}

	// async function getStallsByCustomers(
	// 	months: string[],
	// 	years: string[],
	// 	onSuccess?: Function,
	// ) {
	// 	try {
	// 		const access_token = Cookie.get("access_token");
	// 		axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
	// 		const getStallsByCustomersPromise = axios.post<StallsAndShifts>(
	// 			api.stalls.getByCustomers,
	// 			{ months, years },
	// 		);
	// 		await toast.promise(getStallsByCustomersPromise, {
	// 			loading: "Obteniendo puestos",
	// 			success: ({ data }) => {
	// 				dispatch(setStalls(data.stalls));
	// 				dispatch(setShifts(data.shifts));
	// 				onSuccess?.();
	// 				return "Puestos obtenidos";
	// 			},
	// 			error: "Error obteniendo puestos",
	// 		});
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	async function updateStall(
		stall: StallData,
		stallId: string,
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const updateStallPromise = axios.put<StallWithId>(
				api.stalls.update(stallId),
				stall,
			);
			await toast.promise(updateStallPromise, {
				loading: "Actualizando puesto",
				success: ({ data }) => {
					dispatch(setStalls(stalls.map((s) => (s.id === stallId ? data : s))));
					onSuccess?.();
					return "Puesto actualizado";
				},
				error: "Error actualizando puesto",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteStall(
		stallId: string,
		stallShifts: string[],
		stalls: StallWithId[],
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const deleteStallPromise = axios.post<StallWithId>(
				api.stalls.delete(stallId),
				{ shifts: stallShifts },
			);
			await toast.promise(deleteStallPromise, {
				loading: "Eliminando puesto",
				success: () => {
					dispatch(setStalls(stalls.filter((s) => s.id !== stallId)));
					dispatch(
						setShifts(
							shifts.filter(
								(shift) => !stallShifts.includes(shift.id as string),
							),
						),
					);
					onSuccess?.();
					return "Puesto eliminado";
				},
				error: "Error eliminando puesto",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function addWorker(
		stallId: string,
		worker: HandleStallWorker,
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const addWorkerPromise = axios.post<StallWithId>(
				api.stalls.addWorker(stallId),
				worker,
			);
			toast.promise(addWorkerPromise, {
				loading: "Agregando persona",
				success: ({ data }) => {
					dispatch(setStalls(stalls.map((s) => (s.id === stallId ? data : s))));
					onSuccess?.();
					return "Persona agregada";
				},
				error: "Error agregando persona",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function removeWorker(
		stallId: string,
		workerId: string,
		workerShifts: string[],
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const removeWorkerPromise = axios.post<StallWithId>(
				api.stalls.removeWorker(stallId, workerId),
				{ shifts: workerShifts },
			);
			await toast.promise(removeWorkerPromise, {
				loading: "Eliminando persona",
				success: ({ data }) => {
					dispatch(setStalls(stalls.map((s) => (s.id === stallId ? data : s))));
					dispatch(
						setShifts(
							shifts.filter(
								(shift) => !workerShifts.includes(shift.id as string),
							),
						),
					);
					onSuccess?.();
					return "Persona eliminada";
				},
				error: "Error eliminando persona",
			});
		} catch (error) {
			console.log(error);
		}
	}

	return {
		createStall,
		// getStallsByCustomers,
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
		createStall: (data: StallData, onSuccess?: Function) => Promise<void>,
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
		createStall(data, () => resetCreateStallData());
	};

	const handleUpdateStall = (
		updateStall: (
			data: StallData,
			stallId: string,
			onSuccess?: Function,
		) => Promise<void>,
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
			onSuccess?: Function,
		) => Promise<void>,
		stall: StallWithId,
	) => {
		if (!position)
			return toast.message("Datos incompletos", {
				description: "Seleccione un cargo",
			});
		if (!selectedWorker)
			return toast.message("Datos incompletos", {
				description: "Seleccione una persona",
			});
		if (stall.workers.some((w) => w.id === selectedWorker.id))
			return toast.message("Persona ya asignada", {
				description: "La persona ya está asignada a este puesto",
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
		addWorker(stall.id, data, () => setSelectedWorker(undefined));
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
