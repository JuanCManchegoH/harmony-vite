import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company, Convention } from "../services/company/types";
import { useAppDispatch } from "./store";

interface ConventionDto {
	name: string;
	color: string;
	abbreviation: string;
	keep: boolean;
}

export const useConventions = () => {
	const dispatch = useAppDispatch();

	async function createConvention(
		convention: ConventionDto,
		onSuccess?: Function,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const createConventionPromise = axios.post<Company>(
				api.company.createConvention,
				convention,
			);
			await toast.promise(createConventionPromise, {
				loading: "Creando convención",
				success: ({ data }) => {
					dispatch(setCompany(data));
					onSuccess?.();
					return "Convención creada";
				},
				error: "Error creando convención",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function updateConvention(
		convention: ConventionDto,
		conventionId: string,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const updateConventionPromise = axios.put<Company>(
				api.company.updateConvention(conventionId),
				convention,
			);
			await toast.promise(updateConventionPromise, {
				loading: "Actualizando convención",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Convención actualizada";
				},
				error: "Error actualizando convención",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteConvention(conventionId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const deleteConventionPromise = axios.delete<Company>(
				api.company.deleteConvention(conventionId),
			);
			await toast.promise(deleteConventionPromise, {
				loading: "Eliminando convención",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Convención eliminada";
				},
				error: "Error eliminando convención",
			});
		} catch (error) {
			console.log(error);
		}
	}

	return { createConvention, updateConvention, deleteConvention };
};

export const useHandleConventions = (convention?: Convention) => {
	const keep = convention ? convention.keep : true;
	const [data, setData] = useState({
		name: convention?.name || "",
		abbreviation: convention?.abbreviation || "",
		color: convention?.color || "",
		keep,
	});
	const resetForm = () => {
		setData({
			name: "",
			abbreviation: "",
			color: "",
			keep: true,
		});
	};

	const handleCreateConvention = async (
		createConvention: (
			convention: ConventionDto,
			onSuccess?: Function,
		) => Promise<void>,
	) => {
		if (!data.name || !data.abbreviation || !data.color) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		if (data.abbreviation.length > 2) {
			return toast.message("Datos inválidos", {
				description: "La abreviatura debe tener máximo 2 caracteres",
			});
		}
		await createConvention(data, resetForm);
	};

	const handleUpdateConvention = (
		updateConvention: (
			convention: ConventionDto,
			conventionId: string,
		) => Promise<void>,
		id: string,
	) => {
		if (!data.name || !data.abbreviation || !data.color) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		if (data.abbreviation.length > 2) {
			return toast.message("Datos inválidos", {
				description: "La abreviatura debe tener máximo 2 caracteres",
			});
		}
		updateConvention(data, id);
	};

	return { data, setData, handleCreateConvention, handleUpdateConvention };
};
