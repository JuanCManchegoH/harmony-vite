import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UsersWithId } from "./types";

export const DEFAULT_USER: UsersWithId = {
	id: "",
	userName: "",
	email: "",
	company: "",
	customers: [],
	workers: [],
	roles: [],
	active: false,
};

export interface UsersState {
	loading: boolean;
	users: UsersWithId[];
}

const initialState: UsersState = {
	loading: false,
	users: [],
};

export const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setUsers: (state, action: PayloadAction<UsersWithId[]>) => {
			state.users = action.payload;
		},
	},
});

export const { setLoading, setUsers } = usersSlice.actions;
export default usersSlice.reducer;
