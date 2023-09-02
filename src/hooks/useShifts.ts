import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "sonner";
import api from "../services/api";
import { setLoading, setShifts } from "../services/shifts/slice";
import {
	CreateShift,
	ShiftWithId,
	UpdateShift,
} from "../services/shifts/types";
import { useAppDispatch } from "./store";

interface Data {
	created: ShiftWithId[];
	updated: ShiftWithId[];
}

export const useShifts = () => {
	const dispatch = useAppDispatch();

	async function createAndUpdate(
		create: CreateShift[],
		update: UpdateShift[],
		shifts: ShiftWithId[],
	) {
		dispatch(setLoading(true));
		try {
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<Data>(api.shifts.createAndUpdate, {
				create,
				update,
			});
			toast.success("Turnos creados");
			if (data.created.length > 0) {
				dispatch(setShifts([...shifts, ...data.created]));
			}
			if (data.updated.length > 0) {
				const updatedShifts = shifts.map((shift) => {
					const updatedShift = data.updated.find(
						(updatedShift) => updatedShift.id === shift.id,
					);
					if (updatedShift) {
						return updatedShift;
					}
					return shift;
				});
				dispatch(setShifts(updatedShifts));
			}

			return data;
		} catch {
			toast.error("Error Creando turnos");
		}
	}

	return {
		createAndUpdate,
	};
};
