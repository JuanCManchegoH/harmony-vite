import { ShiftWithId } from "../../services/shifts/types";
import { StallWorker } from "../../services/stalls/types";
import { getDiference, minutesToString } from "../../utils/hours";

export default function WorkerInfo({
	worker,
	shifts,
}: { worker: StallWorker; shifts: ShiftWithId[] }) {
	const wokedHours = shifts.reduce((acc, shift) => {
		const { minutes } = getDiference(shift.startTime, shift.endTime);
		return acc + minutes;
	}, 0);

	return (
		<section className="grid grid-cols-2 gap-4 mt-4">
			<div className="relative">
				<label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900">
					Nombre
				</label>
				<p className="text-sm font-medium text-gray-900 border text-left p-2 rounded-md truncate">
					{worker.name}
				</p>
			</div>
			<div className="relative">
				<label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900">
					Identificación
				</label>
				<p className="text-sm font-medium text-gray-900 border text-left p-2 rounded-md truncate">
					{worker.identification}
				</p>
			</div>
			<div className="relative">
				<label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900">
					Cargo
				</label>
				<p className="text-sm font-medium text-gray-900 border text-left p-2 rounded-md truncate">
					{worker.position}
				</p>
			</div>
			<div className="relative">
				<label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900">
					Codigo Harmony
				</label>
				<p className="text-sm font-medium text-gray-900 border text-left p-2 rounded-md truncate">
					{worker.id}
				</p>
			</div>
			<div className="relative">
				<label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900">
					Horas trabajadas en todos los puestos
				</label>
				<p className="text-sm font-medium text-gray-900 border text-left p-2 rounded-md truncate">
					{minutesToString(wokedHours)}
				</p>
			</div>
			<div className="relative">
				<label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900">
					Agregado por
				</label>
				<p className="text-sm font-medium text-gray-900 border text-left p-2 rounded-md truncate">
					{worker.createdBy}
				</p>
			</div>
		</section>
	);
}
