import { createSlice } from "@reduxjs/toolkit";
import { ShiftWithId } from "./types";

export const DEFAULT_SHIFT: ShiftWithId = {
	id: "",
	day: "",
	startTime: "",
	endTime: "",
	color: "gray",
	abbreviation: "",
	description: "",
	sequence: "",
	position: "",
	type: "",
	active: false,
	keep: false,
	worker: "",
	workerName: "",
	stall: "",
	stallName: "",
	createdBy: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface ShiftsState {
	loading: { state: boolean; message: string };
	shifts: ShiftWithId[];
}

const initialState: ShiftsState = {
	loading: { state: false, message: "" },
	shifts: [],
};

export const shiftsSlice = createSlice({
	name: "shifts",
	initialState,
	reducers: {
		setLoading: (
			state,
			action: { payload: { state: boolean; message: string } },
		) => {
			state.loading = action.payload;
		},
		setShifts: (state, action) => {
			state.shifts = action.payload;
		},
	},
});

export const { setLoading, setShifts } = shiftsSlice.actions;
export default shiftsSlice.reducer;
