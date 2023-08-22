import { createSlice } from "@reduxjs/toolkit";
import { WorkerWithId } from "./types";

export const DEFAULT_WORKER: WorkerWithId = {
	id: "",
	name: "",
	identification: "",
	city: "",
	phone: "",
	address: "",
	fields: [],
	tags: [],
	company: "",
	active: true,
	userName: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface WorkersState {
	loading: boolean;
	workers: WorkerWithId[];
}

const initialState: WorkersState = {
	loading: false,
	workers: [],
};

export const workersSlice = createSlice({
	name: "workers",
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setWorkers: (state, action) => {
			state.workers = action.payload;
		},
	},
});

export const { setLoading, setWorkers } = workersSlice.actions;
export default workersSlice.reducer;
