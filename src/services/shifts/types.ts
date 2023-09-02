export interface Shift {
	day: string;
	startTime: string;
	endTime: string;
	color: "green" | "gray" | "yellow" | "sky" | "red";
	abbreviation: string;
	description: string;
	position: string;
	sequence: string;
	mode: string;
	type: string;
	active: boolean;
	keep: boolean;
	worker: string;
	stall: string;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface ShiftWithId extends Shift {
	id: string;
}

export interface CreateShift {
	day: string;
	startTime: string;
	endTime: string;
	color: "green" | "gray" | "yellow" | "sky" | "red";
	abbreviation: string;
	description: string;
	position: string;
	sequence: string;
	mode: string;
	type: string;
	active: boolean;
	keep: boolean;
	worker: string;
	stall: string;
}

export interface UpdateShift {
	startTime: string;
	endTime: string;
	color: "green" | "gray" | "yellow" | "sky" | "red";
	abbreviation: string;
	mode: string;
	type: string;
	active: boolean;
	keep: boolean;
}
