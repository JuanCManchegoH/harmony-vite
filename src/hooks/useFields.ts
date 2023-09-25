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

	async function createField(
		field: FieldDto,
		type: string,
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const createFieldPromise = axios.post<Company>(
				type === "customers"
					? api.company.createCustomerField
					: api.company.createWorkerField,
				field,
			);
			await toast.promise(createFieldPromise, {
				loading: "Creando campo",
				success: ({ data }) => {
					dispatch(setCompany(data));
					onSuccess?.();
					return "Campo creado";
				},
				error: "Error creando campo",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function updateField(field: FieldDto, fieldId: string, type: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const updateFieldPromise = axios.put<Company>(
				type === "customers"
					? api.company.updateCustomerField(fieldId)
					: api.company.updateWorkerField(fieldId),
				field,
			);
			await toast.promise(updateFieldPromise, {
				loading: "Actualizando campo",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Campo actualizado";
				},
				error: "Error actualizando campo",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteField(fieldId: string, type: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const deleteFieldPromise = axios.delete<Company>(
				type === "customers"
					? api.company.deleteCustomerField(fieldId)
					: api.company.deleteWorkerField(fieldId),
			);
			await toast.promise(deleteFieldPromise, {
				loading: "Eliminando campo",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Campo eliminado";
				},
				error: "Error eliminando campo",
			});
		} catch (error) {
			console.log(error);
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
			onSuccess?: Function,
		) => Promise<void>,
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
		createField({ ...rest }, type, resetForm);
	};

	const handleUpdateField = (
		updateField: (field: FieldDto, id: string, type: string) => Promise<void>,
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
