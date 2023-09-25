import axios from "axios";
import ExcelJS from "exceljs";
import Cookie from "js-cookie";
import { Dispatch, useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { Field as CompanyField } from "../services/company/types";
import { setWorkers } from "../services/workers/slice";
import { Field, HandleWorker, WorkerWithId } from "../services/workers/types";
import cities from "../utils/cities";
import { useAppDispatch } from "./store";

export const useWorkers = (workers: WorkerWithId[]) => {
	const dispatch = useAppDispatch();

	async function createWorker(worker: HandleWorker, onSuccess?: Function) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const createWorkerPromise = axios.post<WorkerWithId>(
				api.workers.create,
				worker,
			);
			await toast.promise(createWorkerPromise, {
				loading: "Creando persona",
				success: ({ data }) => {
					dispatch(setWorkers([...workers, data]));
					onSuccess?.();
					return "Persona creada";
				},
				error: "Error creando persona",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function searchWorkers(
		search: string,
		limit: number,
		offset: number,
		setNext: Dispatch<React.SetStateAction<boolean>>,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const searchWorkersPromise = axios.get<WorkerWithId[]>(
				api.workers.search(search, limit, offset),
			);
			await toast.promise(searchWorkersPromise, {
				loading: "Buscando personas",
				success: ({ data }) => {
					dispatch(setWorkers(data));
					return "Personas encontradas";
				},
				error: "Error buscando personas",
			});
			const nextData = await axios.get<WorkerWithId[]>(
				api.workers.search(search, limit, offset + limit),
			);
			nextData.data.length > 0 ? setNext(true) : setNext(false);
		} catch (error) {
			console.log(error);
		}
	}

	async function getWorkersByIds(ids: string[]) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const getWorkersByIdsPromise = axios.post<WorkerWithId[]>(
				api.workers.getByIds,
				{ ids },
			);
			await toast.promise(getWorkersByIdsPromise, {
				loading: "Cargando personas",
				success: ({ data }) => {
					dispatch(setWorkers(data));
					return "Personas cargadas";
				},
				error: "Error cargando personas",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function updateWorker(worker: HandleWorker, workerId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const updateWorkerPromise = axios.put<WorkerWithId>(
				api.workers.update(workerId),
				worker,
			);
			await toast.promise(updateWorkerPromise, {
				loading: "Actualizando persona",
				success: ({ data }) => {
					dispatch(
						setWorkers(workers.map((c) => (c.id === workerId ? data : c))),
					);
					return "Persona actualizada";
				},
				error: "Error actualizando persona",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteWorker(workerId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const deleteWorkerPromise = axios.delete(api.workers.delete(workerId));
			await toast.promise(deleteWorkerPromise, {
				loading: "Eliminando persona",
				success: () => {
					dispatch(setWorkers(workers.filter((c) => c.id !== workerId)));
					return "Persona eliminada";
				},
				error: "Error eliminando persona",
			});
		} catch (error) {
			console.log(error);
		}
	}

	return {
		createWorker,
		searchWorkers,
		getWorkersByIds,
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
		createWorker: (worker: HandleWorker, onSuccess?: Function) => Promise<void>,
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
		await createWorker(worker, resetForm);
	};

	const handleUpdate = async (
		updateWorker: (worker: HandleWorker, workerId: string) => Promise<void>,
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

export const useUploadFile = (fields: CompanyField[]) => {
	const [file, setFile] = useState<FileState>({
		name: null,
		type: null,
		size: null,
		arrayBuffer: new ArrayBuffer(0),
	});

	const downloadTemplate = async () => {
		const workBook = new ExcelJS.Workbook();
		const workSheet = workBook.addWorksheet("Clientes");

		workSheet.columns = [
			{ header: "Nombre", key: "name", width: 20 },
			{ header: "Identificación", key: "identification", width: 20 },
			{ header: "Ciudad", key: "city", width: 20 },
			{ header: "Teléfono", key: "phone", width: 20 },
			{ header: "Dirección", key: "address", width: 20 },
			{ header: "Etiquetas", key: "tags", width: 20 },
			...fields.map((field) => ({
				header: field.name,
				key: field.name,
				width: 20,
			})),
		];

		// second page with all cities
		const citiesSheet = workBook.addWorksheet("Ciudades");
		const names = cities.map((city) => ({ city: city.name }));
		citiesSheet.columns = [{ header: "Ciudad", key: "city", width: 20 }];
		citiesSheet.addRows(names);

		const buffer = await workBook.xlsx.writeBuffer();
		const blob = new Blob([buffer], { type: "application/vnd.ms-excel" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "Plantilla Personal.xlsx";
		link.click();
	};

	const handleUpload = async () => {
		if (!file.name) {
			toast.error("Seleccione un archivo");
			return;
		}
		const access_token = Cookie.get("access_token");
		axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
		const workBook = new ExcelJS.Workbook();
		await workBook.xlsx.load(file.arrayBuffer);
		const workSheet = workBook.worksheets[0];
		const workers: WorkerExcelData[] = [];

		workSheet.eachRow((row, index) => {
			if (index === 1) return;
			const workerFields: Field[] = [];
			row.eachCell((cell, index) => {
				if (index > 6) {
					workerFields.push({
						id: fields[index - 7].id,
						name: fields[index - 7].name,
						size: fields[index - 7].size,
						type: fields[index - 7].type,
						options: fields[index - 7].options,
						required: fields[index - 7].required,
						value: cell.value?.toString() as string,
					});
				}
			});
			const tagCell = row.getCell(6).value?.toString();
			const tags = tagCell ? tagCell.toString().split(",") : [];

			const worker = {
				name: row.getCell(1).value?.toString() as string,
				identification: row.getCell(2).value?.toString() as string,
				city: row.getCell(3).value?.toString() as string,
				phone: row.getCell(4).value?.toString() as string,
				address: row.getCell(5).value?.toString() as string,
				tags,
				active: true,
				fields: workerFields,
			};
			workers.push(worker);
		});
		console.log(workers);
		const uploadPromise = axios.post<WorkerWithId[]>(
			api.workers.createAndUpdate,
			{ workers },
		);

		await toast.promise(uploadPromise, {
			loading: "Subiendo archivo",
			success: () => {
				setFile({
					name: null,
					type: null,
					size: null,
					arrayBuffer: new ArrayBuffer(0),
				});
				return "Archivo subido";
			},
			error: "Error subiendo archivo",
		});
	};

	return {
		file,
		setFile,
		downloadTemplate,
		handleUpload,
	};
};

export interface FileState {
	name: string | null;
	type: string | null;
	size: number | null;
	arrayBuffer: ArrayBuffer;
}

export interface WorkerExcelData {
	name: string;
	identification: string;
	city: string;
	phone: string;
	address: string;
	tags: string[];
	active: boolean;
	fields: Field[];
}

export interface WorkerData {
	name: string;
	identification: string;
	city: string;
	phone: string;
	address: string;
	tags: string[];
	active: boolean;
}
