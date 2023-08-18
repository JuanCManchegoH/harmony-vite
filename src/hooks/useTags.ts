import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "sonner";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company } from "../services/company/types";
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
