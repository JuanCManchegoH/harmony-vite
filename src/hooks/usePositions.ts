import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "sonner";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company } from "../services/company/types";
import { useAppDispatch } from "./store";

interface PositionDto {
	name: string;
	value: number;
	year: number;
}

export const usePositions = () => {
	const dispatch = useAppDispatch();

	async function createPosition(position: PositionDto) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<Company>(
				api.company.createPosition,
				position,
			);
			toast.success("Cargo creado");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al crear cargo");
		}
	}

	async function updatePosition(position: PositionDto, positionId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<Company>(
				api.company.updatePosition(positionId),
				position,
			);
			toast.success("Cargo actualizado");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al actualizar cargo");
		}
	}

	async function deletePosition(positionId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.delete<Company>(
				api.company.deletePosition(positionId),
			);
			toast.success("Cargo eliminado");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al eliminar cargo");
		}
	}

	return { createPosition, updatePosition, deletePosition };
};
