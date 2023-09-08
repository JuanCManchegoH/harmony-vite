import { configureStore } from "@reduxjs/toolkit";
import logsReducer from "./appLogs/slice";
import authReducer from "./auth/slice";
import customersReducer from "./customers/slice";
import shiftsReducer from "./shifts/slice";
import stallsReducer from "./stalls/slice";
import usersReducer from "./users/slice";
import workersReducer from "./workers/slice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		users: usersReducer,
		customers: customersReducer,
		workers: workersReducer,
		stalls: stallsReducer,
		shifts: shiftsReducer,
		logs: logsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
