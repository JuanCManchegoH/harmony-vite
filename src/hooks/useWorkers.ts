import axios from "axios";
import Cookie from "js-cookie";
import { Dispatch, useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { Field as CompanyField } from "../services/company/types";
import { setLoading, setWorkers } from "../services/workers/slice";
import { Field, HandleWorker, WorkerWithId } from "../services/workers/types";
import { useAppDispatch } from "./store";

export const useWorkers = (workers: WorkerWithId[]) => {
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

	async function updateWorker(worker: HandleWorker, workerId: string) {
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

export const useHandleWorker = (
	workerFields: CompanyField[],
	worker?: WorkerWithId,
) => {
	const [fields, setFields] = useState<Field[]>(
		[
			...(worker?.fields || []),
			...workerFields.map((field) => ({
				id: field.id,
				name: field.name,
				size: field.size,
				type: field.type,
				options: field.options,
				required: field.required,
				value: field.type === "date" ? new Date().toISOString() : "",
			})),
		] || [],
	);
	const [data, setData] = useState<WorkerData>({
		name: "",
		identification: "",
		city: "",
		phone: "",
		address: "",
		tags: [],
		active: true,
	});

	const resetForm = () => {
		setData({
			name: "",
			identification: "",
			city: "",
			phone: "",
			address: "",
			tags: [],
			active: true,
		});
		setFields(
			workerFields.map((field) => ({
				id: field.id,
				name: field.name,
				size: field.size,
				type: field.type,
				options: field.options,
				required: field.required,
				value: field.type === "date" ? new Date().toISOString() : "",
			})),
		);
	};

	const handleCreate = async (
		createWorker: (worker: HandleWorker) => Promise<WorkerWithId | undefined>,
	) => {
		if (
			!data.name ||
			!data.identification ||
			!data.city ||
			!data.phone ||
			!data.address
		)
			return toast.error("Todos los campos con * son obligatorios");
		if (fields.some((field) => field.required && !field.value))
			return toast.error("Todos los campos con * son obligatorios");
		const tags = data.tags.length === 0 ? ["all"] : data.tags;
		const worker = {
			...data,
			tags,
			fields,
		};
		await createWorker(worker).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	const handleUpdate = async (
		updateWorker: (
			worker: HandleWorker,
			workerId: string,
		) => Promise<WorkerWithId | undefined>,
		id: string,
	) => {
		if (
			!data.name ||
			!data.identification ||
			!data.city ||
			!data.phone ||
			!data.address
		)
			return toast.error("Todos los campos con * son obligatorios");
		if (fields.some((field) => field.required && !field.value))
			return toast.error("Todos los campos con * son obligatorios");
		const tags = data.tags.length === 0 ? ["all"] : data.tags;
		const worker = {
			...data,
			tags,
			fields,
		};
		await updateWorker(worker, id);
	};

	return {
		fields,
		setFields,
		data,
		setData,
		resetForm,
		handleCreate,
		handleUpdate,
	};
};

export interface WorkerData {
	name: string;
	identification: string;
	city: string;
	phone: string;
	address: string;
	tags: string[];
	active: boolean;
}
