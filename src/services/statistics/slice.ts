import { createSlice } from "@reduxjs/toolkit";
import { ShiftWithId } from "../shifts/types";
import { StallWithId } from "../stalls/types";
import { WorkerWithId } from "../workers/types";

export interface StatisticsState {
	stalls: StallWithId[];
	workers: WorkerWithId[];
	shifts: ShiftWithId[];
	groupedShifts: ShiftWithId[][];
	groupedShiftsLength: number;
	groupsToShow: ShiftWithId[][];
}

const initialState: StatisticsState = {
	stalls: [],
	workers: [],
	shifts: [],
	groupedShifts: [],
	groupedShiftsLength: 0,
	groupsToShow: [],
};

export const statisticsSlice = createSlice({
	name: "statistics",
	initialState,
	reducers: {
		setStatisticsStalls: (state, action) => {
			state.stalls = action.payload;
		},
		setStatisticsWorkers: (state, action) => {
			state.workers = action.payload;
		},
		setStatisticsShifts: (state, action) => {
			state.shifts = action.payload;
		},
		setGroupedShifts: (state, action) => {
			state.groupedShifts = action.payload;
		},
		setGroupedShiftsLength: (state, action) => {
			state.groupedShiftsLength = action.payload;
		},
		setGroupsToShow: (state, action) => {
			state.groupsToShow = action.payload;
		},
	},
});

export const {
	setStatisticsStalls,
	setStatisticsWorkers,
	setStatisticsShifts,
	setGroupedShifts,
	setGroupedShiftsLength,
	setGroupsToShow,
} = statisticsSlice.actions;
export default statisticsSlice.reducer;
