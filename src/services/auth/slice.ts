import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookie from "js-cookie";
import { DEFAULT_COMPANY } from "../company/slice";
import { Company } from "../company/types";
import { Profile } from "./types";

export const DEFAULT_PROFILE: Profile = {
	id: "",
	userName: "",
	email: "",
	company: DEFAULT_COMPANY,
	customers: [],
	roles: [],
	active: false,
};

export interface AuthState {
	loading: boolean;
	access_token: string;
	profile: Profile;
}
export type Token = string;

const tokenCookie = Cookie.get("access_token");
const access_token: Token = tokenCookie ? (tokenCookie as Token) : "";

const initialState: AuthState = {
	loading: false,
	access_token,
	profile: DEFAULT_PROFILE,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setToken: (state, action: PayloadAction<Token>) => {
			state.access_token = action.payload;
		},
		setProfile: (state, action: PayloadAction<Profile>) => {
			state.profile = action.payload;
		},
		setCompany: (state, action: PayloadAction<Company>) => {
			state.profile.company = action.payload;
		},
	},
});

export const { setLoading, setToken, setProfile, setCompany } =
	authSlice.actions;
export default authSlice.reducer;
