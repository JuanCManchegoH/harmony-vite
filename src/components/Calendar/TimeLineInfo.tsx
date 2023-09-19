import { FlagIcon, IdentificationIcon } from "@heroicons/react/24/solid";
import { Card, MultiSelect, MultiSelectItem, Text, Title } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import EmptyState from "../../common/EmptyState";
import { useAppSelector } from "../../hooks/store";
import { getDiference, minutesToString } from "../../utils/hours";

export interface TimeLineIndoFilters {
	selectedEWorker: string;
	selectedWorkers: string;
	setSelectedWorkers: Dispatch<SetStateAction<string>>;
	selectedTypes: string[];
	setSelectedTypes: Dispatch<SetStateAction<string[]>>;
	selectedAbbreviations: string[];
	setSelectedAbbreviations: Dispatch<SetStateAction<string[]>>;
	selectedPositions: string[];
	setSelectedPositions: Dispatch<SetStateAction<string[]>>;
}

export default function TimeLineInfo({
	filters,
}: {
	filters: TimeLineIndoFilters;
}) {
	const { events } = useAppSelector((state) => state.events);
	const types = [
		{ name: "Evento de cliente", value: "customer" },
		{ name: "Evento", value: "event" },
	];
	const abbreviations = events.reduce((acc, event) => {
		if (acc.includes(event.abbreviation)) return acc;
		else return [...acc, event.abbreviation];
	}, [] as string[]);
	const positions = events.reduce((acc, event) => {
		if (acc.includes(event.position)) return acc;
		else return [...acc, event.position];
	}, [] as string[]);

	return (
		<Card className="bg-gray-50 p-2 mt-2">
			<header className="flex">
				<Title color="sky">Opciones de linea temporal</Title>
			</header>
			<main className="border-t my-2">
				<section className="grid grid-cols-2 gap-2 my-2">
					<Title className="col-span-2">Filtros</Title>
					<div>
						<label className="font-bold text-xs uppercase text-gray-700">
							Nombre
						</label>
						<input
							type="text"
							className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
							value={filters.selectedWorkers}
							onChange={(e) => filters.setSelectedWorkers(e.target.value)}
							placeholder="ej: Guillermo"
						/>
					</div>
					<div>
						<label className="font-bold text-xs uppercase text-gray-700">
							Tipo de evento
						</label>
						<MultiSelect
							placeholder="Tipo de evento"
							value={filters.selectedTypes}
							onValueChange={filters.setSelectedTypes}
						>
							{types.map((type) => (
								<MultiSelectItem key={type.name} value={type.value}>
									{type.name}
								</MultiSelectItem>
							))}
						</MultiSelect>
					</div>
					<div>
						<label className="font-bold text-xs uppercase text-gray-700">
							Abreviaturas
						</label>
						<MultiSelect
							placeholder="Abreviaturas"
							value={filters.selectedAbbreviations}
							onValueChange={filters.setSelectedAbbreviations}
						>
							{abbreviations.map((abbreviation) => (
								<MultiSelectItem key={abbreviation} value={abbreviation}>
									{abbreviation}
								</MultiSelectItem>
							))}
						</MultiSelect>
					</div>
					<div>
						<label className="font-bold text-xs uppercase text-gray-700">
							Cargos
						</label>
						<MultiSelect
							placeholder="Cargos"
							value={filters.selectedPositions}
							onValueChange={filters.setSelectedPositions}
						>
							{positions.map((position) => (
								<MultiSelectItem key={position} value={position}>
									{position}
								</MultiSelectItem>
							))}
						</MultiSelect>
					</div>
				</section>
				<section className="grid grid-cols-2 gap-2 my-2 pt-2 border-t">
					<Title className="col-span-2 truncate">
						Eventos de la persona:{" "}
						{
							events.find((event) => event.worker === filters.selectedEWorker)
								?.workerName
						}
					</Title>
					{events.filter((event) => event.worker === filters.selectedEWorker)
						.length === 0 && (
						<div className="col-span-2">
							<EmptyState>
								<FlagIcon className="w-10 h-10 text-sky-500" />
								<Text className="text-gray-600">
									Selecciona una persona para ver sus eventos.
								</Text>
							</EmptyState>
						</div>
					)}
					{events
						.filter((event) => event.worker === filters.selectedEWorker)
						.sort((a, b) => {
							const nameA = a.day.toLowerCase();
							const nameB = b.day.toLowerCase();
							if (nameA < nameB) return -1;
							if (nameA > nameB) return 1;
							return 0;
						})
						.map((event) => {
							const { minutes } = getDiference(event.startTime, event.endTime);
							return (
								<Card
									key={event.id}
									className={`grid grid-cols-1 gap-1 p-2 border-2 border-${event.color}-500 bg-${event.color}-100 text-${event.color}-700`}
								>
									<div className="grid grid-cols-3 gap-2">
										<p className="col-span-2 flex items-center text-sm font-medium text-left">
											<div>
												<IdentificationIcon className="w-5 h-5 mr-1" />
											</div>
											<p className="truncate">{event.workerName}</p>
										</p>
										<span className="flex text-sm justify-end font-bold">
											{event.day.substring(0, 5)}
										</span>
									</div>
									<div className="grid grid-cols-2 gap-2">
										<p className="text-sm text-left truncate font-bold">
											{event.abbreviation} | {event.startTime} - {event.endTime}
										</p>
										<span className="flex text-sm justify-end font-bold">
											{minutesToString(minutes)}H
										</span>
									</div>
									{event.customer !== event.stall && (
										<span className="text-sm text-left truncate font-bold">
											{event.stallName}
										</span>
									)}
									<p className="text-sm text-left truncate font-bold">
										{event.customerName}
									</p>
								</Card>
							);
						})}
				</section>
			</main>
		</Card>
	);
}
