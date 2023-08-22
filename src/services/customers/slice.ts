import { createSlice } from "@reduxjs/toolkit";
import { CustomerWithId } from "./types";

export const DEFAULT_CUSTOMER: CustomerWithId = {
	id: "",
	name: "",
	identification: "",
	city: "",
	contact: "",
	phone: "",
	address: "",
	fields: [],
	tags: [],
	branches: [],
	company: "",
	active: true,
	userName: "",
	updatedBy: "",
	createdAt: "",
	updatedAt: "",
};

export interface CustomersState {
	loading: boolean;
	customers: CustomerWithId[];
}

const initialState: CustomersState = {
	loading: false,
	customers: [],
};

export const customersSlice = createSlice({
	name: "customers",
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setCustomers: (state, action) => {
			state.customers = action.payload;
		},
	},
});

export const { setLoading, setCustomers } = customersSlice.actions;
export default customersSlice.reducer;
