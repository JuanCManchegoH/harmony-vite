import { Select, SelectItem } from "@tremor/react";
import Label from "../../../common/Label";
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
		workerData,
		setWorkerData,
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
					<Label text="Puesto o Cliente">
						<Select
							placeholder="Seleccionar puesto o cliente"
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
					</Label>
					<Label text="Secuencia">
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
					</Label>
					<Label text="Descripción" className="col-span-2">
						<textarea
							className="w-full px-4 py-2 rounded-md border border-gray-200 focus:border-sky-500 focus:outline-none max-h-20 text-sm"
							placeholder="Descripción"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</Label>
				</>
			)}
			<div className="col-span-2">
				<AddStallWorker
					data={workerData}
					setData={setWorkerData}
					selectedWorker={selectedWorker}
					setSelectedWorker={setSelectedWorker}
				/>
			</div>
		</div>
	);
}
