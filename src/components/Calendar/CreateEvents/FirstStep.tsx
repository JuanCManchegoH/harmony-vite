import { Select, SelectItem } from "@tremor/react";
import { useAppSelector } from "../../../hooks/store";
import { CreateEvent } from "../../../hooks/useCalendar";
import AddStallWorker from "../AddStallWorker";

export default function FirstStep({
	createEvent,
}: {
	createEvent: CreateEvent;
}) {
	const {
		list,
		selectedStall,
		setSelectedStall,
		selectedWorker,
		setSelectedWorker,
		position,
		setPosition,
		selectedSequence,
		setSelectedSequence,
	} = createEvent;

	const { sequences } = useAppSelector((state) => state.auth.profile.company);
	return (
		<div className="grid grid-cols-2 gap-2 mt-4">
			{list.length > 0 && (
				<>
					<Select
						placeholder="Seleccionar puesto*"
						value={selectedStall?.id || ""}
						onValueChange={(value) =>
							setSelectedStall(
								list.find((item) => item?.id === value) || list[0],
							)
						}
					>
						{list.map((item) => (
							<SelectItem key={item?.id} value={item?.id || ""}>
								{item?.name}
							</SelectItem>
						))}
					</Select>
					<Select
						placeholder="Seleccionar secuencia"
						value={selectedSequence || ""}
						onValueChange={(value) => setSelectedSequence(value)}
					>
						{sequences.map((item) => (
							<SelectItem key={item?.id} value={item?.name || ""}>
								{item?.name}
							</SelectItem>
						))}
					</Select>
				</>
			)}
			<div className="col-span-2">
				<AddStallWorker
					position={position}
					setPosition={setPosition}
					selectedWorker={selectedWorker}
					setSelectedWorker={setSelectedWorker}
				/>
			</div>
		</div>
	);
}
