export interface Field {
	id: string;
	name: string;
	type: string;
	size: number;
	options: string[];
	required: boolean;
	value: string;
}

export interface Worker {
	name: string;
	identification: string;
	city: string;
	phone: string;
	address: string;
	fields: Field[];
	tags: string[];
	company: string;
	active: boolean;
	userName: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface WorkerWithId extends Worker {
	id: string;
}

export interface HandleWorker {
	name: string;
	identification: string;
	city: string;
	phone: string;
	address: string;
	fields: Field[];
	tags: string[];
	active: boolean;
}
