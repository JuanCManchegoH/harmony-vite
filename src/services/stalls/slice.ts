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
	createdBy: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface StallsState {
	loading: boolean;
	stalls: StallWithId[];
}

const initialState: StallsState = {
	loading: false,
	stalls: [],
};

export const stallsSlice = createSlice({
	name: "stalls",
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setStalls: (state, action) => {
			state.stalls = action.payload;
		},
	},
});

export const { setLoading, setStalls } = stallsSlice.actions;
export default stallsSlice.reducer;
