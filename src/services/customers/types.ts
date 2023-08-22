export interface Field {
	id: string;
	name: string;
	type: string;
	size: number;
	options: string[];
	required: boolean;
	value: string;
}

export interface Customer {
	name: string;
	identification: string;
	city: string;
	contact: string;
	phone: string;
	address: string;
	fields: Field[];
	tags: string[];
	branches: string[];
	company: string;
	active: boolean;
	userName: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface CustomerWithId extends Customer {
	id: string;
}

export interface HandleCustomer {
	name: string;
	identification: string;
	city: string;
	contact: string;
	phone: string;
	address: string;
	fields: Field[];
	tags: string[];
	branches: string[];
	active: boolean;
}
