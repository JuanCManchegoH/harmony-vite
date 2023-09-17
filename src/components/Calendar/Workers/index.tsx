import {
	ArrowLongLeftIcon,
	ArrowLongRightIcon,
	ArrowSmallRightIcon,
	IdentificationIcon,
	MagnifyingGlassIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { Button, Card, Text, TextInput } from "@tremor/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { toast } from "sonner";
import Modal from "../../../common/RightModal";
import { useAppSelector } from "../../../hooks/store";
import { useHandleWorker, useWorkers } from "../../../hooks/useWorkers";
import { WorkerWithId } from "../../../services/workers/types";
import classNames from "../../../utils/classNames";
import { validateRoles } from "../../../utils/roles";
import List from "./List";
import Worker from "./Worker";

export default function Workers({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const profile = useAppSelector((state) => state.auth.profile);
	const workers = useAppSelector((state) => state.workers.workers);
	const { createWorker, updateWorker, searchWorkers } = useWorkers(workers);
	const {
		resetForm,
		data,
		setData,
		fields,
		setFields,
		handleCreate,
		handleUpdate,
	} = useHandleWorker(profile.company.workerFields);
	const [openWorker, setOpenWorker] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [search, setSearch] = useState("");
	const [next, setNext] = useState<boolean>(false);
	const [offset, setOffset] = useState<number>(0);
	const limit = 10;

	const [selectedWorker, setSelectedWorker] = useState<WorkerWithId | null>(
		null,
	);

	const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!search) return toast.error("Ingrese un nombre o identificación");
		if (search.length < 4) return toast.error("Ingrese al menos 4 caracteres");
		await searchWorkers(search, limit, 0, setNext);
		setOffset(10);
	};

	const Next = async () => {
		await searchWorkers(search, 10, offset, setNext);
		setOffset(offset + 10);
	};

	const Prev = async () => {
		await searchWorkers(search, 10, offset - 20, setNext);
		setOffset(offset - 10);
	};

	const action = () => {
		if (selectedWorker) {
			handleUpdate(updateWorker, selectedWorker.id);
		} else {
			handleCreate(createWorker);
		}
	};

	return (
		<Modal
			open={open}
			setOpen={setOpen}
			icon={IdentificationIcon}
			title="Personal"
			btnText={selectedWorker ? "Actualizar" : "Crear"}
			action={
				validateRoles(profile.roles, ["handle_workers"], []) &&
				(selectedWorker || openWorker)
					? action
					: undefined
			}
		>
			<section className="flex flex-col gap-2">
				<header className="flex gap-2">
					<nav aria-label="Breadcrumb" className="w-full">
						<ol className="flex space-x-2 rounded-md bg-white shadow p-2">
							<li>
								<button
									type="button"
									className={classNames(
										"hover:text-gray-600 cursor-pointer flex items-center",
										!selectedWorker ? "text-gray-600" : "text-gray-500",
									)}
									onClick={() => {
										setSelectedWorker(null);
										setOpenWorker(false);
									}}
								>
									<IdentificationIcon className="h-5 w-5" />
									<Text className="hover:text-gray-600 ml-2">Personal</Text>
								</button>
							</li>
							{selectedWorker && (
								<li className="flex items-center">
									<ArrowSmallRightIcon
										className="h-4 w-4 text-gray-600"
										aria-hidden="true"
									/>
									<Text className="hover:text-gray-600 ml-2">
										{selectedWorker.name}
									</Text>
								</li>
							)}
							{openWorker && (
								<li className="flex items-center">
									<ArrowSmallRightIcon
										className="h-4 w-4 text-gray-600"
										aria-hidden="true"
									/>
									<Text className="hover:text-gray-600 ml-2">
										Crear Persona
									</Text>
								</li>
							)}
						</ol>
					</nav>
					{validateRoles(profile.roles, ["handle_workers"], []) && (
						<Button
							color="sky"
							size="xs"
							onClick={() => {
								resetForm();
								!selectedWorker && setOpenWorker(!openWorker);
								selectedWorker && setSelectedWorker(null);
							}}
							variant={openWorker || selectedWorker ? "secondary" : "primary"}
						>
							{openWorker || selectedWorker ? "Volver" : "Crear Persona"}
						</Button>
					)}
				</header>
				{!openWorker && !selectedWorker && (
					<form
						className="flex items-center gap-2"
						onSubmit={(e) => handleSearch(e)}
					>
						<TextInput
							color="sky"
							placeholder="Nombre o identificación"
							icon={MagnifyingGlassIcon}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button color="sky" size="sm" variant="secondary" type="submit">
							Buscar
						</Button>
						{validateRoles(profile.roles, ["handle_workers"], []) && (
							<Card className="flex p-2 w-10 justify-center group cursor-pointer hover:bg-red-500">
								<TrashIcon
									className={classNames(
										"h-5 w-5 group-hover:text-white",
										openDelete ? "text-rose-500" : "text-gray-500",
									)}
									onClick={() => setOpenDelete(!openDelete)}
								/>
							</Card>
						)}
					</form>
				)}
				{openWorker || selectedWorker ? (
					<Worker
						data={data}
						setData={setData}
						fields={fields}
						setFields={setFields}
					/>
				) : null}
				{!openWorker && !selectedWorker && (
					<>
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
						<List
							openDelete={openDelete}
							setSelectedWorker={setSelectedWorker}
							setData={setData}
							setFields={setFields}
						/>
					</>
				)}
			</section>
		</Modal>
	);
}
