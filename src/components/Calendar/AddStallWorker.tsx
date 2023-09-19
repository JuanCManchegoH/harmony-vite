import {
	ArrowLongLeftIcon,
	ArrowLongRightIcon,
	IdentificationIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Card,
	Select,
	SelectItem,
	Text,
	TextInput,
} from "@tremor/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { toast } from "sonner";
import EmptyState from "../../common/EmptyState";
import { useAppSelector } from "../../hooks/store";
import { useWorkers } from "../../hooks/useWorkers";
import { WorkerWithId } from "../../services/workers/types";
import classNames from "../../utils/classNames";

export default function AddStallWorker({
	position,
	setPosition,
	selectedWorker,
	setSelectedWorker,
}: {
	position: string;
	setPosition: Dispatch<SetStateAction<string>>;
	selectedWorker: WorkerWithId | undefined;
	setSelectedWorker: Dispatch<SetStateAction<WorkerWithId | undefined>>;
}) {
	const { positions } = useAppSelector((state) => state.auth.profile.company);
	const { workers } = useAppSelector((state) => state.workers);
	const { searchWorkers } = useWorkers(workers);
	const [search, setSearch] = useState("");
	const [next, setNext] = useState<boolean>(false);
	const [offset, setOffset] = useState<number>(0);
	const limit = 6;

	const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!search) return toast.error("Ingrese un nombre o identificación");
		if (search.length < 4) return toast.error("Ingrese al menos 4 caracteres");
		await searchWorkers(search, limit, 0, setNext);
		setOffset(6);
	};

	const Next = async () => {
		await searchWorkers(search, 6, offset, setNext);
		setOffset(offset + 6);
	};

	const Prev = async () => {
		await searchWorkers(search, 6, offset - 12, setNext);
		setOffset(offset - 6);
	};

	return (
		<div className="grid grid-cols-2 gap-2">
			<form
				className="flex items-center gap-2 col-span-2"
				onSubmit={(e) => handleSearch(e)}
			>
				<TextInput
					placeholder="Buscar trabajador*"
					color="sky"
					maxLength={20}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Button color="sky" size="sm" variant="secondary" type="submit">
					Buscar
				</Button>
			</form>
			<div className="col-span-2">
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
				{workers.length > 0 && (
					<div className="grid grid-cols-3 gap-2 border rounded-md p-2">
						{workers.map((worker) => (
							<Card
								key={worker.id}
								className={classNames(
									selectedWorker?.id === worker.id ? "bg-sky-400" : "",
									"flex flex-col items-center gap-2 p-2 cursor-pointer hover:bg-sky-100",
								)}
								onClick={() => {
									setSelectedWorker(worker);
								}}
							>
								<Text
									className={classNames(
										selectedWorker?.id === worker.id ? "text-white" : "",
									)}
								>
									{worker.name}
								</Text>
								<Text
									className={classNames(
										selectedWorker?.id === worker.id ? "text-white" : "",
									)}
								>
									{worker.identification}
								</Text>
							</Card>
						))}
					</div>
				)}
			</div>
			{offset > 10 || next ? (
				<div className="flex justify-end gap-4 py-2">
					<ArrowLongLeftIcon
						className={classNames(
							"h-5 w-5 cursor-pointer hover:text-sky-400",
							offset <= 10 ? "hidden" : "",
						)}
						onClick={Prev}
					/>
					<ArrowLongRightIcon
						className={classNames(
							"h-5 w-5 cursor-pointer hover:text-sky-400",
							!next ? "hidden" : "",
						)}
						onClick={Next}
					/>
				</div>
			) : null}

			<Select
				className="col-span-2"
				placeholder="Cargo*"
				value={position}
				onValueChange={(value) => setPosition(value)}
			>
				{positions.map((position) => (
					<SelectItem value={position.name}>{position.name}</SelectItem>
				))}
			</Select>
		</div>
	);
}
