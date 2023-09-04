import { Select, SelectItem } from "@tremor/react";
import { CreateEvent } from "../../../hooks/Handlers/usePlans";
import { useAppSelector } from "../../../hooks/store";
import AddStallWorker from "../Stalls/AddStallWorker";

export default function FirstStep({
	createEvent,
}: {
	createEvent: CreateEvent;
}) {
	const {
		list,
		selected,
		setSelected,
		selectedWorker,
		setSelectedWorker,
		position,
		setPosition,
		selectedSequence,
		setSelectedSequence,
		description,
		setDescription,
	} = createEvent;

	const { sequences } = useAppSelector((state) => state.auth.profile.company);
	return (
		<div className="grid grid-cols-2 gap-2 mt-4">
			{list.length > 0 && (
				<>
					<Select
						placeholder="Seleccionar puesto o cliente*"
						value={selected?.id || ""}
						onValueChange={(value) =>
							setSelected(list.find((item) => item?.id === value) || list[0])
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
					<textarea
						className="col-span-2 px-4 py-2 rounded-md border border-gray-200 focus:border-sky-500 focus:outline-none max-h-20 text-sm"
						placeholder="Descripción*"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
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
