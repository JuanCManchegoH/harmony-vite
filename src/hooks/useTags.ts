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

	async function createTag(tag: TagDto) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<Company>(api.company.createTag, tag);
			toast.success("Etiqueta creada");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al crear etiqueta");
		}
	}

	async function updateTag(tag: TagDto, tagId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<Company>(
				api.company.updateTag(tagId),
				tag,
			);
			toast.success("Etiqueta actualizada");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al actualizar etiqueta");
		}
	}

	async function deleteTag(tagId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.delete<Company>(
				api.company.deleteTag(tagId),
			);
			toast.success("Etiqueta eliminada");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al eliminar etiqueta");
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
		createTag: (tag: TagDto) => Promise<Company | undefined>,
	) => {
		if (!data.name) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		await createTag(data).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	const handleUpdateTag = (
		updateTag: (tag: TagDto, tagId: string) => Promise<Company | undefined>,
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
