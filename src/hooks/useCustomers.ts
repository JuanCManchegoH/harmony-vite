import axios from "axios";
import ExcelJS from "exceljs";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { Field as CompanyField } from "../services/company/types";
import { setCustomers } from "../services/customers/slice";
import {
	CustomerWithId,
	Field,
	HandleCustomer,
} from "../services/customers/types";
import cities from "../utils/cities";
import { useAppDispatch } from "./store";

export const useCustomers = (customers: CustomerWithId[]) => {
	const dispatch = useAppDispatch();

	async function createCustomer(
		customer: HandleCustomer,
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const createCustomerPromise = axios.post<CustomerWithId>(
				api.customers.create,
				customer,
			);
			await toast.promise(createCustomerPromise, {
				loading: "Creando cliente",
				success: ({ data }) => {
					dispatch(setCustomers([...customers, data]));
					onSuccess?.();
					return "Cliente creado";
				},
				error: "Error creando cliente",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function getCustomers() {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const getCustomersPromise = axios.get<CustomerWithId[]>(
				api.customers.getByCompany,
			);
			await toast.promise(getCustomersPromise, {
				loading: "Cargando clientes",
				success: ({ data }) => {
					dispatch(setCustomers(data));
					return "Clientes cargados";
				},
				error: "Error cargando clientes",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function updateCustomer(customer: HandleCustomer, customerId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const updateCustomerPromise = axios.put<CustomerWithId>(
				api.customers.update(customerId),
				customer,
			);
			await toast.promise(updateCustomerPromise, {
				loading: "Actualizando cliente",
				success: ({ data }) => {
					dispatch(
						setCustomers(
							customers.map((c) => (c.id === customerId ? data : c)),
						),
					);
					return "Cliente actualizado";
				},
				error: "Error actualizando cliente",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteCustomer(customerId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const deleteCustomerPromise = axios.delete<CustomerWithId>(
				api.customers.delete(customerId),
			);
			await toast.promise(deleteCustomerPromise, {
				loading: "Eliminando cliente",
				success: () => {
					dispatch(setCustomers(customers.filter((c) => c.id !== customerId)));
					return "Cliente eliminado";
				},
				error: "Error eliminando cliente",
			});
		} catch (error) {
			console.log(error);
		}
	}

	return {
		createCustomer,
		getCustomers,
		updateCustomer,
		deleteCustomer,
	};
};

export const useHandleCustomer = (
	customerFields: CompanyField[],
	customer?: CustomerWithId,
) => {
	const [fields, setFields] = useState<Field[]>(
		[
			...(customer?.fields || []),
			...customerFields.map((field) => ({
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
	const [tag, setTag] = useState<string>("");
	const [branch, setBranch] = useState<string>("");
	const [data, setData] = useState<CustomerData>({
		name: customer?.name || "",
		identification: customer?.identification || "",
		city: customer?.city || "",
		contact: customer?.contact || "",
		phone: customer?.phone || "",
		address: customer?.address || "",
		tags: customer?.tags || [],
		branches: customer?.branches || [],
		active: customer?.active || true,
	});
	const resetForm = () => {
		setData({
			name: "",
			identification: "",
			city: "",
			contact: "",
			phone: "",
			address: "",
			tags: [] as string[],
			branches: [] as string[],
			active: true,
		});
		setFields(
			customerFields.map((field) => ({
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
		createCustomer: (
			customer: HandleCustomer,
			onSuccess?: Function,
		) => Promise<void>,
	) => {
		if (!data.name || !data.identification || !data.city) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		if (fields.some((field) => field.required && !field.value)) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		const tags = data.tags.length === 0 ? ["all"] : data.tags;
		const customer = {
			...data,
			tags,
			fields,
		};
		await createCustomer(customer, resetForm);
	};

	const handleUpdate = async (
		updateCustomer: (customer: HandleCustomer, id: string) => Promise<void>,
		id: string,
	) => {
		if (!data.name || !data.identification || !data.city) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		if (fields.some((field) => field.required && !field.value)) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		const tags = data.tags.length === 0 ? ["all"] : data.tags;
		const customer = {
			...data,
			tags,
			fields,
		};
		await updateCustomer(customer, id);
	};

	return {
		fields,
		setFields,
		branch,
		setBranch,
		tag,
		setTag,
		data,
		setData,
		resetForm,
		handleCreate,
		handleUpdate,
	};
};

export const useUploadFile = (fields: CompanyField[]) => {
	const dispatch = useAppDispatch();
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
			{ header: "Contacto", key: "contact", width: 20 },
			{ header: "Teléfono", key: "phone", width: 20 },
			{ header: "Dirección", key: "address", width: 20 },
			{ header: "Etiquetas", key: "tags", width: 20 },
			{ header: "Sedes", key: "branches", width: 20 },
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
		link.download = "Plantilla Clientes.xlsx";
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
		const customers: CustomerExcelData[] = [];

		workSheet.eachRow((row, index) => {
			if (index === 1) return;
			const customerFields: Field[] = [];
			row.eachCell((cell, index) => {
				if (index > 8) {
					customerFields.push({
						id: fields[index - 9].id,
						name: fields[index - 9].name,
						size: fields[index - 9].size,
						type: fields[index - 9].type,
						options: fields[index - 9].options,
						required: fields[index - 9].required,
						value: cell.value?.toString() as string,
					});
				}
			});
			const tagCell = row.getCell(7).value?.toString();
			const tags = tagCell ? tagCell.toString().split(",") : [];
			const branchCell = row.getCell(8).value?.toString();
			const branches = branchCell ? branchCell.toString().split(",") : [];

			const customer = {
				name: row.getCell(1).value?.toString() as string,
				identification: row.getCell(2).value?.toString() as string,
				city: row.getCell(3).value?.toString() as string,
				contact: row.getCell(4).value?.toString() as string,
				phone: row.getCell(5).value?.toString() as string,
				address: row.getCell(6).value?.toString() as string,
				tags,
				branches,
				active: true,
				fields: customerFields,
			};
			customers.push(customer);
		});
		const uploadPromise = axios.post<CustomerWithId[]>(
			api.customers.createAndUpdate,
			{ customers },
		);

		await toast.promise(uploadPromise, {
			loading: "Cargando clientes",
			success: ({ data }) => {
				setFile({
					name: null,
					type: null,
					size: null,
					arrayBuffer: new ArrayBuffer(0),
				});
				dispatch(setCustomers(data));
				return "Clientes cargados";
			},
			error: "Error cargando clientes",
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

export interface CustomerExcelData {
	name: string;
	identification: string;
	city: string;
	contact: string;
	phone: string;
	address: string;
	tags: string[];
	branches: string[];
	active: boolean;
	fields: Field[];
}

export interface CustomerData {
	name: string;
	identification: string;
	city: string;
	contact: string;
	phone: string;
	address: string;
	tags: string[];
	branches: string[];
	active: boolean;
}
