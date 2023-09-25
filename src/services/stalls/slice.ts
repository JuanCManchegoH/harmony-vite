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
	solved: boolean;
	stalls: StallWithId[];
	createdStallId: string;
}

const initialState: StallsState = {
	solved: false,
	stalls: [],
	createdStallId: "",
};

export const stallsSlice = createSlice({
	name: "stalls",
	initialState,
	reducers: {
		setSolved: (state, action) => {
			state.solved = action.payload;
		},
		setStalls: (state, action) => {
			state.stalls = action.payload;
		},
		setCreatedStallId: (state, action) => {
			state.createdStallId = action.payload;
		},
	},
});

export const { setSolved, setStalls, setCreatedStallId } = stallsSlice.actions;
export default stallsSlice.reducer;
