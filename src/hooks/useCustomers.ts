import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "sonner";
import api from "../services/api";
import { setCustomers, setLoading } from "../services/customers/slice";
import { CustomerWithId, HandleCustomer } from "../services/customers/types";
import { useAppDispatch } from "./store";

export const useCustomers = () => {
	const dispatch = useAppDispatch();

	async function createCustomer(
		customer: HandleCustomer,
		customers: CustomerWithId[],
	) {
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

	async function updateCustomer(
		customer: HandleCustomer,
		customerId: string,
		customers: CustomerWithId[],
	) {
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

	async function deleteCustomer(
		customerId: string,
		customers: CustomerWithId[],
	) {
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
