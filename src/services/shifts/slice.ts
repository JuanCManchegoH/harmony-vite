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
	loading: boolean;
	plansShifts: ShiftWithId[];
	tracingShifts: ShiftWithId[];
}

const initialState: ShiftsState = {
	loading: false,
	plansShifts: [],
	tracingShifts: [],
};

export const shiftsSlice = createSlice({
	name: "shifts",
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setPlansShifts: (state, action) => {
			state.plansShifts = action.payload;
		},
		setTracingShifts: (state, action) => {
			state.tracingShifts = action.payload;
		},
	},
});

export const { setLoading, setPlansShifts, setTracingShifts } =
	shiftsSlice.actions;
export default shiftsSlice.reducer;
