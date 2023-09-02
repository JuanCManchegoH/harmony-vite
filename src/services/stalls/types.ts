import { ShiftWithId } from "../shifts/types";

export interface StallWorker {
	id: string;
	name: string;
	identification: string;
	position: string;
	sequence: string;
	index: number;
	jump: number;
	mode: string;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface Stall {
	name: string;
	description: string;
	ays: string;
	branch: string;
	month: string;
	year: string;
	customer: string;
	customerName: string;
	workers: StallWorker[];
	stage: number;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface StallWithId extends Stall {
	id: string;
}

export interface HandleStallWorker {
	id: string;
	name: string;
	identification: string;
	position: string;
	sequence: string;
	index: number;
	jump: number;
	mode: string;
}

export interface StallsAndShifts {
	stalls: StallWithId[];
	shifts: ShiftWithId[];
}
