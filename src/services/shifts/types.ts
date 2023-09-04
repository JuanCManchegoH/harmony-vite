import { Step } from "../company/types";

export interface Shift {
	day: string;
	startTime: string;
	endTime: string;
	color: "green" | "gray" | "yellow" | "sky" | "red";
	abbreviation: string;
	description: string;
	sequence: string;
	position: string;
	type: string;
	active: boolean;
	keep: boolean;
	worker: string;
	workerName: string;
	stall: string;
	stallName: string;
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
	sequence: string;
	position: string;
	type: string;
	active: boolean;
	keep: boolean;
	worker: string;
	workerName: string;
	stall: string;
	stallName: string;
}

export interface AppliedSequence {
	stall: string;
	worker: string;
	sequence: Step[];
	index: number;
	jump: number;
}

export interface UpdateShift {
	startTime: string;
	endTime: string;
	color: "green" | "gray" | "yellow" | "sky" | "red";
	abbreviation: string;
	type: string;
	active: boolean;
	keep: boolean;
}
