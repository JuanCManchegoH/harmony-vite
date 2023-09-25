import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import { Times } from "../common/SelectHours";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company, Sequence, Step } from "../services/company/types";
import { ColorGroup, sequenceGroups } from "../utils/colors";
import { useAppDispatch } from "./store";

interface SequenceDto {
	name: string;
	steps: Step[];
}

export const useSequences = () => {
	const dispatch = useAppDispatch();

	async function createSequence(sequence: SequenceDto, onSuccess?: Function) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const createSequencePromise = axios.post<Company>(
				api.company.createSequence,
				sequence,
			);
			await toast.promise(createSequencePromise, {
				loading: "Creando secuencia",
				success: ({ data }) => {
					dispatch(setCompany(data));
					onSuccess?.();
					return "Secuencia creada";
				},
				error: "Error creando secuencia",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function updateSequence(sequence: SequenceDto, sequenceId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const updateSequencePromise = axios.put<Company>(
				api.company.updateSequence(sequenceId),
				sequence,
			);
			await toast.promise(updateSequencePromise, {
				loading: "Actualizando secuencia",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Secuencia actualizada";
				},
				error: "Error actualizando secuencia",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteSequence(sequenceId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const deleteSequencePromise = axios.delete<Company>(
				api.company.deleteSequence(sequenceId),
			);
			await toast.promise(deleteSequencePromise, {
				loading: "Eliminando secuencia",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Secuencia eliminada";
				},
				error: "Error eliminando secuencia",
			});
		} catch (error) {
			console.log(error);
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
	const [selectedColor, setSelectedColor] = useState<ColorGroup>(
		sequenceGroups[0],
	);
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
		setSelectedColor(sequenceGroups[0]);
	};
	const handleCreateSequence = (
		createSequence: (
			sequence: SequenceDto,
			onSuccess?: Function,
		) => Promise<void>,
	) => {
		if (!times.name) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		if (steps.length < 2) {
			return toast.message("Datos incompletos", {
				description: "Debe agregar al menos dos pasos",
			});
		}
		const sequenceData = {
			name: times.name,
			steps,
		};
		createSequence(sequenceData, resetForm);
	};

	const handleUpdateSequence = (
		updateSequence: (
			sequence: SequenceDto,
			sequenceId: string,
		) => Promise<void>,
		id: string,
	) => {
		if (!times.name) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		if (steps.length < 2) {
			return toast.message("Datos incompletos", {
				description: "Debe agregar al menos dos pasos",
			});
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
		times,
		setTimes,
		selectedColor,
		setSelectedColor,
	};
};
