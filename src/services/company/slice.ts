import { createSlice } from "@reduxjs/toolkit";
import { Company } from "./types";
export const DEFAULT_COMPANY: Company = {
	id: "",
	name: "",
	website: "",
	workerFields: [],
	customerFields: [],
	positions: [],
	conventions: [],
	sequences: [],
	tags: [],
	pColor: "",
	sColor: "",
	logo: "",
	active: true,
};

const initialState = DEFAULT_COMPANY;

export const companySlice = createSlice({
	name: "company",
	initialState,
	reducers: {},
});

export default companySlice.reducer;
