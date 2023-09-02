import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import { Times } from "../common/SelectHours";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company, Sequence, Step } from "../services/company/types";
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

export const useHandleSequences = (sequence?: Sequence) => {
	const [steps, setSteps] = useState<Step[]>(sequence?.steps || []);
	const [isShift, setIsShift] = useState<boolean>(true);
	const [times, setTimes] = useState<Times>({
		name: sequence?.name || "",
		selectedStartHour: "6",
		selectedStartMinute: "0",
		selectedEndHour: "18",
		selectedEndMinute: "0",
	});

	const resetForm = () => {
		setTimes({
			name: "",
			selectedStartHour: "6",
			selectedStartMinute: "0",
			selectedEndHour: "18",
			selectedEndMinute: "0",
		});
		setSteps([]);
		setIsShift(true);
	};
	const handleCreateSequence = (
		createSequence: (sequence: SequenceDto) => Promise<Company | undefined>,
	) => {
		if (!times.name) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		if (steps.length < 2) {
			toast.error("Debe agregar al menos dos pasos");
			return;
		}
		const sequenceData = {
			name: times.name,
			steps,
		};
		createSequence(sequenceData).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	const handleUpdateSequence = (
		updateSequence: (
			sequence: SequenceDto,
			sequenceId: string,
		) => Promise<Company | undefined>,
		id: string,
	) => {
		if (!times.name) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		if (steps.length < 2) {
			toast.error("Debe agregar al menos dos pasos");
			return;
		}
		const sequenceData = {
			name: times.name,
			steps,
		};

		updateSequence(sequenceData, id);
	};

	return {
		handleCreateSequence,
		handleUpdateSequence,
		steps,
		setSteps,
		isShift,
		setIsShift,
		times,
		setTimes,
	};
};
