import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { setCompany } from "../services/auth/slice";
import { Company, Position } from "../services/company/types";
import { useAppDispatch } from "./store";

interface PositionDto {
	name: string;
	value: number;
	year: number;
}

export const usePositions = () => {
	const dispatch = useAppDispatch();

	async function createPosition(position: PositionDto, onSuccess?: Function) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const createPositionPromise = axios.post<Company>(
				api.company.createPosition,
				position,
			);
			await toast.promise(createPositionPromise, {
				loading: "Creando cargo",
				success: ({ data }) => {
					dispatch(setCompany(data));
					onSuccess?.();
					return "Cargo creado";
				},
				error: "Error creando cargo",
			});
		} catch (error) {
			toast.error("Error al crear cargo");
		}
	}

	async function updatePosition(position: PositionDto, positionId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const updatePositionPromise = axios.put<Company>(
				api.company.updatePosition(positionId),
				position,
			);
			await toast.promise(updatePositionPromise, {
				loading: "Actualizando cargo",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Cargo actualizado";
				},
				error: "Error actualizando cargo",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function deletePosition(positionId: string) {
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const deletePositionPromise = axios.delete<Company>(
				api.company.deletePosition(positionId),
			);
			await toast.promise(deletePositionPromise, {
				loading: "Eliminando cargo",
				success: ({ data }) => {
					dispatch(setCompany(data));
					return "Cargo eliminado";
				},
				error: "Error eliminando cargo",
			});
		} catch (error) {
			console.log(error);
		}
	}

	return { createPosition, updatePosition, deletePosition };
};

export const useHandlePosition = (position?: Position) => {
	const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];
	const [data, setData] = useState({
		name: position?.name || "",
		value: position?.value || 0,
		year: position?.year.toString() || years[2],
	});

	const resetForm = () => {
		setData({
			name: "",
			value: 0,
			year: years[2],
		});
	};

	const handleCreatePosition = (
		createPosition: (
			position: PositionDto,
			onSuccess?: Function,
		) => Promise<void>,
	) => {
		if (!data.name || !data.year) {
			return toast.message("Datos incompletos", {
				description: "Todos los campos con * son obligatorios",
			});
		}
		const positionData = {
			...data,
			year: parseInt(data.year),
			value: data.value || 0,
		};
		createPosition(positionData, resetForm);
	};

	const handleUpdatePosition = (
		updatePosition: (
			position: PositionDto,
			positionId: string,
		) => Promise<void>,
		id: string,
	) => {
		if (!data.name || !data.year) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		const positionData = {
			...data,
			year: parseInt(data.year),
			value: data.value || 0,
		};
		updatePosition(positionData, id);
	};

	return {
		years,
		data,
		setData,
		handleCreatePosition,
		handleUpdatePosition,
	};
};
