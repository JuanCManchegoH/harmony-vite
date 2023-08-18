export interface Field {
	id: string;
	name: string;
	type: string;
	options: string[];
	size: number;
	required: boolean;
	active: boolean;
}

export interface Position {
	id: string;
	name: string;
	value: number;
	year: number;
}

export interface Convention {
	id: string;
	name: string;
	color: string;
	abbreviation: string;
}

export interface Step {
	startTime: string;
	endTime: string;
	color: string;
}

export interface Sequence {
	id: string;
	name: string;
	steps: Step[];
}

export interface Tag {
	id: string;
	name: string;
	color: string;
	scope: string;
}

export interface Company {
	id: string;
	name: string;
	website: string;
	workerFields: Field[] | [];
	customerFields: Field[] | [];
	positions: Position[] | [];
	conventions: Convention[] | [];
	sequences: Sequence[] | [];
	tags: Tag[] | [];
	pColor: string;
	sColor: string;
	logo: string;
	active: boolean;
}
