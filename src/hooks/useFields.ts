import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
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

export const useHandleField = (field?: FieldDto) => {
	const required = field ? field.required : false;
	const active = field ? field.active : true;
	const [data, setData] = useState<CreateData>({
		name: field?.name || "",
		size: field?.size || 1,
		type: field?.type || "",
		required,
		active: active,
		option: "",
		options: field?.options || [],
	});

	const resetForm = () => {
		setData({
			name: "",
			size: 1,
			type: "",
			required: false,
			active: true,
			option: "",
			options: [],
		});
	};

	const handleCreateField = (
		createField: (
			field: FieldDto,
			type: string,
		) => Promise<Company | undefined>,
		type: string,
	) => {
		if (!data.name || !data.size || !data.type) {
			return toast.message("Datos incompletos", {
				description: "Debe completar todos los campos",
			});
		}
		if (data.type === "select" && data.options.length === 0) {
			return toast.message("Datos incompletos", {
				description: "Debe agregar al menos una opción",
			});
		}
		const { option, ...rest } = data;
		createField(
			{
				...rest,
			},
			type,
		).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	const handleUpdateField = (
		updateField: (
			field: FieldDto,
			id: string,
			type: string,
		) => Promise<Company | undefined>,
		type: string,
		id: string,
	) => {
		if (!data.name || !data.size || !data.type) {
			return toast.message("Datos incompletos", {
				description: "Debe completar todos los campos",
			});
		}
		if (data.type === "select" && data.options.length === 0) {
			return toast.message("Datos incompletos", {
				description: "Debe agregar al menos una opción",
			});
		}
		const { option, ...rest } = data;
		updateField(
			{
				...rest,
			},
			id,
			type,
		);
	};

	return { data, setData, resetForm, handleCreateField, handleUpdateField };
};

export interface CreateData {
	name: string;
	size: number;
	type: string;
	required: boolean;
	active: boolean;
	option: string;
	options: string[];
}
