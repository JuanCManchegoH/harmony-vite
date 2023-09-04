import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { Field as CompanyField } from "../services/company/types";
import { setCustomers, setLoading } from "../services/customers/slice";
import {
	CustomerWithId,
	Field,
	HandleCustomer,
} from "../services/customers/types";
import { useAppDispatch } from "./store";

export const useCustomers = (customers: CustomerWithId[]) => {
	const dispatch = useAppDispatch();

	async function createCustomer(customer: HandleCustomer) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<CustomerWithId>(
				api.customers.create,
				customer,
			);
			toast.success("Cliente creado");
			dispatch(setCustomers([...customers, data]));
			return data;
		} catch {
			toast.error("Error al crear cliente");
		}
	}

	async function getCustomers() {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.get<CustomerWithId[]>(
				api.customers.getByCompany,
			);
			dispatch(setCustomers(data));
			return data;
		} catch {
			toast.error("Error al obtener clientes");
		}
	}

	async function updateCustomer(customer: HandleCustomer, customerId: string) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<CustomerWithId>(
				api.customers.update(customerId),
				customer,
			);
			toast.success("Cliente actualizado");
			dispatch(
				setCustomers(customers.map((c) => (c.id === customerId ? data : c))),
			);
			return data;
		} catch {
			toast.error("Error al actualizar cliente");
		}
	}

	async function deleteCustomer(customerId: string) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			await axios.delete<CustomerWithId>(api.customers.delete(customerId));
			toast.success("Cliente eliminado");
			dispatch(setCustomers(customers.filter((c) => c.id !== customerId)));
		} catch {
			toast.error("Error al eliminar cliente");
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
		) => Promise<CustomerWithId | undefined>,
	) => {
		if (
			!data.name ||
			!data.identification ||
			!data.city ||
			!data.contact ||
			!data.phone ||
			!data.address
		) {
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
		await createCustomer(customer).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	const handleUpdate = async (
		updateCustomer: (
			customer: HandleCustomer,
			id: string,
		) => Promise<CustomerWithId | undefined>,
		id: string,
	) => {
		if (
			!data.name ||
			!data.identification ||
			!data.city ||
			!data.contact ||
			!data.phone ||
			!data.address
		) {
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
