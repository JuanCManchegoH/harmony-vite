import { XMarkIcon } from "@heroicons/react/24/solid";
import { Badge, Card, Title } from "@tremor/react";
import { Dispatch, SetStateAction, useState } from "react";
import Tracker, { TrackerItem } from "../../common/Tracker";
import { useAppSelector } from "../../hooks/store";
import { ShiftWithId } from "../../services/shifts/types";
import classNames from "../../utils/classNames";
import { DateToSring, MonthDay, getDay } from "../../utils/dates";

export interface EventTimeLineFilters {
	selectedEWorker: string;
	setSelectedEWorker: Dispatch<SetStateAction<string>>;
	selectedWorkers: string;
	selectedTypes: string[];
	selectedAbbreviations: string[];
	selectedPositions: string[];
}

export default function EventsTimeLine({
	monthDays,
	filters,
}: { monthDays: MonthDay[]; filters: EventTimeLineFilters }) {
	const { events } = useAppSelector((state) => state.events);
	const [range, setRange] = useState(0);
	const daysToRender = monthDays.filter((day) => {
		if (range === 0) return Number(getDay(day.date)) <= 15;
		else return Number(getDay(day.date)) > 15;
	});

	// Filters
	const applyFilters = (events: ShiftWithId[]) => {
		return events.filter((event) => {
			const lowerCaseWorkerName = event.workerName.toLowerCase();
			const isSelectedWorker = lowerCaseWorkerName.includes(
				filters.selectedWorkers.toLowerCase(),
			);
			const isSelectedType = filters.selectedTypes.includes(event.type);
			const isSelectedAbbreviation = filters.selectedAbbreviations.includes(
				event.abbreviation,
			);
			const isSelectedPosition = filters.selectedPositions.includes(
				event.position,
			);

			return (
				isSelectedWorker &&
				isSelectedType &&
				isSelectedAbbreviation &&
				isSelectedPosition
			);
		});
	};
	const groupEventsByWorker = applyFilters(events).reduce((acc, event) => {
		const workerIndex = acc.findIndex(
			(workerEvents) => workerEvents[0].worker === event.worker,
		);
		if (workerIndex === -1) {
			acc.push([event]);
		} else {
			acc[workerIndex].push(event);
		}
		return acc;
	}, [] as ShiftWithId[][]);

	return (
		<Card className="p-2 flex flex-col gap-1 bg-transparent relative mt-2">
			<header className="flex justify-between">
				<Title>Listado temporal de eventos</Title>
				<div className="flex gap-2 items-start font-bold">
					<Badge
						color={range === 0 ? "sky" : "gray"}
						className="cursor-pointer select-none"
						onClick={() => setRange(0)}
					>
						01 - 15
					</Badge>
					<Badge
						color={range === 1 ? "sky" : "gray"}
						className="cursor-pointer select-none"
						onClick={() => setRange(1)}
					>
						16 - {monthDays.length}
					</Badge>
				</div>
			</header>
			<section className="flex justify-between">
				{daysToRender.map((day) => (
					<div
						key={`eventtimeline-${getDay(day.date)}`}
						className={classNames(
							day.isHoliday ? "text-rose-400" : "",
							"flex w-full flex-col items-center font-semibold text-sm relative",
						)}
					>
						<p>{day.day.substring(0, 3)}</p>
						<p>{getDay(day.date)}</p>
					</div>
				))}
			</section>
			<main className="mb-2">
				{groupEventsByWorker.map((workerEvents) => {
					const data: TrackerItem[] = daysToRender.map((day) => {
						const events = workerEvents.filter(
							(event) => event.day === DateToSring(day.date),
						);
						return {
							key: `eventtimeline-${getDay(day.date)}`,
							events,
							color: events.length > 0 ? "sky" : "gray",
						};
					});
					return (
						<div key={workerEvents[0].id} className="flex relative pt-10">
							<label className="absolute top-3 flex items-start bg-gray-50 uppercase font-bold">
								<Badge
									className="cursor-pointer select-none"
									icon={
										filters.selectedEWorker === workerEvents[0].worker
											? XMarkIcon
											: undefined
									}
									onClick={() => {
										if (filters.selectedEWorker === workerEvents[0].worker)
											filters.setSelectedEWorker("");
										else filters.setSelectedEWorker(workerEvents[0].worker);
									}}
									size="xs"
									color="sky"
								>
									{workerEvents[0].workerName} | {workerEvents[0].position}
								</Badge>
							</label>
							<Tracker data={data} />
						</div>
					);
				})}
			</main>
		</Card>
	);
}
