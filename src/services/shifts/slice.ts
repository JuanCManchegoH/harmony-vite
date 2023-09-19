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
	customer: "",
	customerName: "",
	createdBy: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface ShiftsState {
	solved: boolean;
	shifts: ShiftWithId[];
}

const initialState: ShiftsState = {
	solved: false,
	shifts: [],
};

export const shiftsSlice = createSlice({
	name: "shifts",
	initialState,
	reducers: {
		setSolved: (state, action) => {
			state.solved = action.payload;
		},
		setShifts: (state, action) => {
			state.shifts = action.payload;
		},
	},
});

export const { setSolved, setShifts } = shiftsSlice.actions;
export default shiftsSlice.reducer;
