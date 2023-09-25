import { IdentificationIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Card, Subtitle, Text } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import EmptyState from "../../../common/EmptyState";
import { useAppSelector } from "../../../hooks/store";
import { WorkerData, useWorkers } from "../../../hooks/useWorkers";
import { Field, WorkerWithId } from "../../../services/workers/types";

export default function List({
	openDelete,
	setSelectedWorker,
	setData,
	setFields,
}: {
	openDelete: boolean;
	setSelectedWorker: Dispatch<SetStateAction<WorkerWithId | null>>;
	setData: Dispatch<SetStateAction<WorkerData>>;
	setFields: Dispatch<SetStateAction<Field[]>>;
}) {
	const fields = useAppSelector(
		(state) => state.auth.profile.company.workerFields,
	);
	const workers = useAppSelector((state) => state.workers.workers);

	const { deleteWorker } = useWorkers(workers);

	const handleSelect = (customer: WorkerWithId) => {
		setData({
			name: customer.name,
			identification: customer.identification,
			city: customer.city,
			phone: customer.phone,
			address: customer.address,
			tags: customer.tags,
			active: customer.active,
		});
		setFields(
			fields.map((field) => {
				const validateValue = customer.fields.find(
					(f) => f.id === field.id,
				)?.value;
				const value = validateValue
					? validateValue
					: field.type === "date"
					? new Date().toISOString()
					: "";
				return {
					id: field.id,
					name: field.name,
					size: field.size,
					type: field.type,
					options: field.options,
					required: field.required,
					value,
				};
			}),
		);
	};

	return (
		<Card className="px-2 py-0">
			{workers.length <= 0 && (
				<div className="py-2">
					<EmptyState>
						<IdentificationIcon className="w-10 h-10 text-sky-500" />
						<Text className="text-gray-600">
							Aquí aparecerá el personal que coincida con tu búsqueda
						</Text>
						<Text className="text-gray-400">
							La búsqueda debe tener al menos 4 caracteres
						</Text>
					</EmptyState>
				</div>
			)}
			<ul className="divide-y divide-gray-200 select-none">
				{workers.map((worker) => (
					<li key={worker.id} className="grid grid-cols-4">
						<button
							type="button"
							className="p-2 cursor-pointer group col-span-2 text-left"
							onClick={() => {
								handleSelect(worker);
								setSelectedWorker(worker);
							}}
						>
							<Text className="group-hover:text-sky-500 truncate max-w-[220px]">
								{worker.name}
							</Text>
							<Subtitle className="group-hover:text-sky-900 text-sm">
								{worker.identification}
							</Subtitle>
						</button>
						<Subtitle className="p-2 flex justify-end items-center text-sm">
							{worker.city}
						</Subtitle>
						{openDelete && (
							<div className="p-2 flex justify-end items-center">
								<XMarkIcon
									className="w-5 h-5 cursor-pointer hover:text-red-500"
									onClick={() =>
										toast("Confirmar acción", {
											action: {
												label: "Eliminar",
												onClick: () => deleteWorker(worker.id),
											},
										})
									}
								/>
							</div>
						)}
					</li>
				))}
			</ul>
		</Card>
	);
}
