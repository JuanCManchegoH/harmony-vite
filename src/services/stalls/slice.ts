import { createSlice } from "@reduxjs/toolkit";
import { StallWithId } from "./types";

export const DEFAULT_STALL: StallWithId = {
	id: "",
	name: "",
	description: "",
	ays: "",
	branch: "",
	month: "",
	year: "",
	customer: "",
	customerName: "",
	workers: [],
	stage: 0,
	tag: "",
	createdBy: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface StallsState {
	loading: boolean;
	plansStalls: StallWithId[];
	tracingStalls: StallWithId[];
}

const initialState: StallsState = {
	loading: false,
	plansStalls: [],
	tracingStalls: [],
};

export const stallsSlice = createSlice({
	name: "stalls",
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setPlansStalls: (state, action) => {
			state.plansStalls = action.payload;
		},
		setTracingStalls: (state, action) => {
			state.tracingStalls = action.payload;
		},
	},
});

export const { setLoading, setPlansStalls, setTracingStalls } =
	stallsSlice.actions;
export default stallsSlice.reducer;
