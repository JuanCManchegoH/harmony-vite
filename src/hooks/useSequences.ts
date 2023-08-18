import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "sonner";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company, Step } from "../services/company/types";
import { useAppDispatch } from "./store";

interface SequenceDto {
	name: string;
	steps: Step[];
}

export const useSequences = () => {
	const dispatch = useAppDispatch();

	async function createSequence(sequence: SequenceDto) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<Company>(
				api.company.createSequence,
				sequence,
			);
			toast.success("Secuencia creada");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al crear secuencia");
		}
	}

	async function updateSequence(sequence: SequenceDto, sequenceId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<Company>(
				api.company.updateSequence(sequenceId),
				sequence,
			);
			toast.success("Secuencia actualizada");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al actualizar secuencia");
		}
	}

	async function deleteSequence(sequenceId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.delete<Company>(
				api.company.deleteSequence(sequenceId),
			);
			toast.success("Secuencia eliminada");
			dispatch(setCompany(data));
			return data;
		} catch {
			toast.error("Error al eliminar secuencia");
		}
	}

	return {
		createSequence,
		updateSequence,
		deleteSequence,
	};
};
