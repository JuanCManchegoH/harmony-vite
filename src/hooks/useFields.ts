import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "sonner";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company } from "../services/company/types";
import { useAppDispatch } from "./store";

interface FieldDto {
	name: string;
	type: string;
	options: string[];
	size: number;
	required: boolean;
	active: boolean;
}

export const useFields = () => {
	const dispatch = useAppDispatch();

	async function createField(field: FieldDto, type: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<Company>(
				type === "customers"
					? api.company.createCustomerField
					: api.company.createWorkerField,
				field,
			);
			toast.success("Campo creado");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al crear campo");
		}
	}

	async function updateField(field: FieldDto, fieldId: string, type: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<Company>(
				type === "customers"
					? api.company.updateCustomerField(fieldId)
					: api.company.updateWorkerField(fieldId),
				field,
			);
			toast.success("Campo actualizado");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al actualizar campo");
		}
	}

	async function deleteField(fieldId: string, type: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.delete<Company>(
				type === "customers"
					? api.company.deleteCustomerField(fieldId)
					: api.company.deleteWorkerField(fieldId),
			);
			toast.success("Campo eliminado");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al eliminar campo");
		}
	}

	return { createField, updateField, deleteField };
};
