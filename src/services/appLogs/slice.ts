import { createSlice } from "@reduxjs/toolkit";
import { Log } from "./types";

export const DEFAULT_LOG: Log = {
	id: "",
	company: "",
	user: "",
	useraName: "",
	type: "",
	message: "",
	month: "",
	year: "",
	createdAt: "",
};

export interface LogsState {
	loading: boolean;
	logs: Log[];
}

const initialState: LogsState = {
	loading: false,
	logs: [],
};

export const logsSlice = createSlice({
	name: "logs",
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setLogs: (state, action) => {
			state.logs = action.payload;
		},
	},
});

export const { setLoading, setLogs } = logsSlice.actions;
export default logsSlice.reducer;
