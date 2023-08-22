import { IdentificationIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
	Card,
	Subtitle,
	Table,
	TableCell,
	TableRow,
	Text,
} from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { WorkerData } from ".";
import EmptyState from "../../../common/EmptyState";
import { useAppSelector } from "../../../hooks/store";
import { useWorkers } from "../../../hooks/useWorkers";
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
	const { deleteWorker } = useWorkers();

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
		<Card className="p-2">
			{workers.length <= 0 && (
				<EmptyState>
					<IdentificationIcon className="w-10 h-10 text-sky-500" />
					<Text className="text-gray-600">
						Aquí aparecerá el personal que coincida con tu búsqueda
					</Text>
					<Text className="text-gray-400">
						La búsqueda debe tener al menos 4 caracteres
					</Text>
				</EmptyState>
			)}
			<Table>
				{workers.map((worker) => (
					<TableRow key={worker.id} className="border-b">
						{openDelete && (
							<TableCell className="p-2">
								<XMarkIcon
									className="w-5 h-5 cursor-pointer hover:text-red-500"
									onClick={() => deleteWorker(worker.id, workers)}
								/>
							</TableCell>
						)}
						<TableCell
							className="p-2 cursor-pointer group"
							onClick={() => {
								handleSelect(worker);
								setSelectedWorker(worker);
							}}
						>
							<Text className="group-hover:text-sky-500">{worker.name}</Text>
							<Subtitle className="group-hover:text-sky-900">
								{worker.identification}
							</Subtitle>
						</TableCell>
						<TableCell className="p-2">{worker.city}</TableCell>
					</TableRow>
				))}
			</Table>
		</Card>
	);
}
