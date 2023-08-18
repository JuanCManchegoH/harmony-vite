import { Company } from "../company/types";

export type Token = string;

export interface Profile {
	id: string;
	userName: string;
	email: string;
	company: Company;
	customers: string[];
	workers: string[];
	roles: string[];
	active: boolean;
}
