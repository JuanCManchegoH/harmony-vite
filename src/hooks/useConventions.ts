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

	async function createConvention(convention: ConventionDto) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<Company>(
				api.company.createConvention,
				convention,
			);
			toast.success("Convención creada");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al crear convención");
		}
	}

	async function updateConvention(
		convention: ConventionDto,
		conventionId: string,
	) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<Company>(
				api.company.updateConvention(conventionId),
				convention,
			);
			toast.success("Convención actualizada");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al actualizar convención");
		}
	}

	async function deleteConvention(conventionId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.delete<Company>(
				api.company.deleteConvention(conventionId),
			);
			toast.success("Convención eliminada");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al eliminar convención");
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
		) => Promise<Company | undefined>,
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
		await createConvention(data).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	const handleUpdateConvention = (
		updateConvention: (
			convention: ConventionDto,
			conventionId: string,
		) => Promise<Company | undefined>,
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
