import { createSlice } from "@reduxjs/toolkit";
import { ShiftWithId } from "./types";

export const DEFAULT_SHIFT: ShiftWithId = {
	id: "",
	day: "",
	startTime: "",
	endTime: "",
	color: "",
	abreviation: "",
	description: "",
	mode: "",
	type: "",
	active: false,
	keep: false,
	worker: "",
	stall: "",
	customer: "",
	createdBy: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface ShiftsState {
	loading: boolean;
	shifts: ShiftWithId[];
}

const initialState: ShiftsState = {
	loading: false,
	shifts: [],
};

export const shiftsSlice = createSlice({
	name: "shifts",
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setShifts: (state, action) => {
			state.shifts = action.payload;
		},
	},
});

export const { setLoading, setShifts } = shiftsSlice.actions;
export default shiftsSlice.reducer;
