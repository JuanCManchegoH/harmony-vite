import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company, Tag } from "../services/company/types";
import { useAppDispatch } from "./store";

interface TagDto {
	name: string;
	color: string;
	scope: string;
}

export const useTags = () => {
	const dispatch = useAppDispatch();

	async function createTag(tag: TagDto, onSuccess?: Function) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const createTagPromise = axios.post<Company>(api.company.createTag, tag);
			await toast.promise(createTagPromise, {
				loading: "Creando etiqueta",
				success: ({ data }) => {
					dispatch(setCompany(data));
					onSuccess?.();
					return "Etiqueta creada";
				},
				error: "Error creando etiqueta",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function updateTag(tag: TagDto, tagId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const updateTagPromise = axios.put<Company>(
				api.company.updateTag(tagId),
				tag,
			);
			await toast.promise(updateTagPromise, {
				loading: "Actualizando etiqueta",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Etiqueta actualizada";
				},
				error: "Error actualizando etiqueta",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteTag(tagId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const deleteTagPromise = axios.delete<Company>(
				api.company.deleteTag(tagId),
			);
			await toast.promise(deleteTagPromise, {
				loading: "Eliminando etiqueta",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Etiqueta eliminada";
				},
				error: "Error eliminando etiqueta",
			});
		} catch (error) {
			console.log(error);
		}
	}

	return { createTag, updateTag, deleteTag };
};

export const useHandleTags = (tag?: Tag) => {
	const scopes = [
		{ name: "stalls", value: "Puestos" },
		{ name: "customers", value: "Clientes" },
		{ name: "workers", value: "Personal" },
	];
	const [data, setData] = useState({
		name: tag?.name || "",
		color: tag?.color || "gray",
		scope: tag?.scope || scopes[0].name,
	});

	const resetForm = () => {
		setData({
			name: "",
			color: "gray",
			scope: scopes[0].name,
		});
	};

	const handleCreate = async (
		createTag: (tag: TagDto, onSuccess?: Function) => Promise<void>,
	) => {
		if (!data.name) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		await createTag(data, resetForm);
	};

	const handleUpdateTag = (
		updateTag: (tag: TagDto, tagId: string) => Promise<void>,
		id: string,
	) => {
		if (!data.name) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		updateTag(data, id);
	};
	return { data, setData, scopes, handleCreate, handleUpdateTag };
};
