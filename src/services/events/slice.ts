import { createSlice } from "@reduxjs/toolkit";
import { ShiftWithId } from "../shifts/types";

export interface ShiftsState {
	loading: { state: boolean; message: string };
	events: ShiftWithId[];
}

const initialState: ShiftsState = {
	loading: { state: false, message: "" },
	events: [],
};

export const eventsSlice = createSlice({
	name: "events",
	initialState,
	reducers: {
		setLoading: (
			state,
			action: { payload: { state: boolean; message: string } },
		) => {
			state.loading = action.payload;
		},
		setEvents: (state, action) => {
			state.events = action.payload;
		},
	},
});

export const { setLoading, setEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
