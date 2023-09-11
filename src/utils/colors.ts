// interface
export interface ColorGroup {
	name: string;
	bgColor: string;
	selectedColor: string;
	color: "sky" | "red" | "green" | "yellow" | "gray";
	type: string;
	abbreviation: string;
	description?: string;
}

// colors
export const conventionsColors = [
	{ name: "Ausencia", value: "red", abbreviation: "AU" },
	{ name: "Seguimiento", value: "sky", abbreviation: "SE" },
];

export const sequenceGroups: ColorGroup[] = [
	{
		name: "Turno",
		bgColor: "bg-green-400",
		selectedColor: "ring-green-500",
		color: "green",
		abbreviation: "T",
		type: "shift",
	},
	{
		name: "Descanso",
		bgColor: "bg-gray-300",
		selectedColor: "ring-gray-400",
		color: "gray",
		abbreviation: "X",
		type: "rest",
	},
];

export const calendarColors: ColorGroup[] = [
	{
		name: "Turno",
		bgColor: "bg-green-400",
		selectedColor: "ring-green-500",
		color: "green",
		abbreviation: "T",
		description: "Turno",
		type: "shift",
	},
	{
		name: "Descanso",
		bgColor: "bg-gray-300",
		selectedColor: "ring-gray-400",
		color: "gray",
		abbreviation: "X",
		description: "Descanso",
		type: "rest",
	},
	{
		name: "Adicional",
		bgColor: "bg-yellow-400",
		selectedColor: "ring-yellow-500",
		color: "yellow",
		abbreviation: "AD",
		type: "event",
	},
	{
		name: "Ausencia",
		bgColor: "bg-red-400",
		selectedColor: "ring-red-500",
		color: "red",
		abbreviation: "AU",
		type: "event",
	},
	{
		name: "Seguimiento",
		bgColor: "bg-sky-400",
		selectedColor: "ring-sky-500",
		color: "sky",
		abbreviation: "SE",
		type: "event",
	},
];

export const colorOps = {
	add: ["green", "yellow"],
	sub: ["red", "sky"],
};
