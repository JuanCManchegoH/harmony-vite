import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "sonner";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company } from "../services/company/types";
import { useAppDispatch } from "./store";

interface ConventionDto {
	name: string;
	color: string;
	abbreviation: string;
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
