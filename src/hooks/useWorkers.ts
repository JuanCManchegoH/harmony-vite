import axios from "axios";
import Cookie from "js-cookie";
import { Dispatch } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { setLoading, setWorkers } from "../services/workers/slice";
import { HandleWorker, WorkerWithId } from "../services/workers/types";
import { useAppDispatch } from "./store";

export const useWorkers = () => {
	const dispatch = useAppDispatch();

	async function createWorker(worker: HandleWorker) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<WorkerWithId>(
				api.workers.create,
				worker,
			);
			toast.success("Persona creada");
			return data;
		} catch {
			toast.error("Error al crear persona");
		}
	}

	async function searchWorkers(
		search: string,
		limit: number,
		offset: number,
		setNext: Dispatch<React.SetStateAction<boolean>>,
	) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.get<WorkerWithId[]>(
				api.workers.search(search, limit, offset),
			);
			const nextData = await axios.get<WorkerWithId[]>(
				api.workers.search(search, limit, offset + limit),
			);
			nextData.data.length > 0 ? setNext(true) : setNext(false);
			dispatch(setWorkers(data));
			return data;
		} catch {
			toast.error("Error al buscar personal");
		}
	}

	async function updateWorker(
		worker: HandleWorker,
		workerId: string,
		workers: WorkerWithId[],
	) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<WorkerWithId>(
				api.workers.update(workerId),
				worker,
			);
			toast.success("Persona actualizada");
			dispatch(setWorkers(workers.map((c) => (c.id === workerId ? data : c))));
			return data;
		} catch {
			toast.error("Error al actualizar persona");
		}
	}

	async function deleteWorker(workerId: string, workers: WorkerWithId[]) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			await axios.delete(api.workers.delete(workerId));
			toast.success("Persona eliminada");
			dispatch(setWorkers(workers.filter((c) => c.id !== workerId)));
		} catch {
			toast.error("Error al eliminar persona");
		}
	}

	return {
		createWorker,
		searchWorkers,
		updateWorker,
		deleteWorker,
	};
};
