export interface User {
	userName: string;
	email: string;
	company: string;
	customers: string[];
	workers: string[];
	roles: string[];
	active: boolean;
}

export interface UsersWithId extends User {
	id: string;
}

export interface CreateUser {
	userName: string;
	email: string;
	company: string;
	password: string;
	customers: string[];
	workers: string[];
	roles: string[];
}

export interface UpdateUser {
	userName: string;
	email: string;
	customers: string[];
	workers: string[];
	roles: string[];
	active: boolean;
}
