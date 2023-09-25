import {
	Cog6ToothIcon,
	IdentificationIcon,
	PencilSquareIcon,
	ShieldExclamationIcon,
	TagIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { Badge, Card, Text, Title } from "@tremor/react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../common/CenteredModal";
import { Dropdown, DropdownItem } from "../../common/DropDown";
import EmptyState from "../../common/EmptyState";
import { useAppSelector } from "../../hooks/store";
import {
	useHandleStall,
	useHandleStallWorker,
	useStalls,
} from "../../hooks/useStalls";
import { CustomerWithId } from "../../services/customers/types";
import { shiftTypes } from "../../services/shifts/types";
import { StallWithId } from "../../services/stalls/types";
import classNames from "../../utils/classNames";
import { MonthDay } from "../../utils/dates";
import { getDiference, minutesToString } from "../../utils/hours";
import { validateRoles } from "../../utils/roles";
import AddStallWorker from "./AddStallWorker";
import HandleStall from "./HandleStall";
import StallWorker from "./StallWorker";

export default function StallInfo({
	stall,
	monthDays,
	selectedDay,
	selectedWorkerId,
	setSelectedWorkerId,
	selectedMonth,
	selectedYear,
	actualCustomer,
}: {
	stall: StallWithId;
	monthDays: MonthDay[];
	selectedDay: string;
	selectedWorkerId: string;
	setSelectedWorkerId: Dispatch<SetStateAction<string>>;
	selectedMonth: string;
	selectedYear: string;
	actualCustomer?: CustomerWithId;
}) {
	const { profile } = useAppSelector((state) => state.auth);
	const { stalls } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const { updateStall, addWorker, deleteStall, removeWorker } = useStalls(
		stalls,
		shifts,
	);
	const { stallData, setStallData, handleUpdateStall } = useHandleStall(
		selectedMonth,
		selectedYear,
		actualCustomer,
		stall,
	);
	const {
		selectedWorker,
		setSelectedWorker,
		position,
		setPosition,
		handleAddWorker,
	} = useHandleStallWorker();

	const [openAddWorker, setOpenAddWorker] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const [deleteVisible, setDeleteVisible] = useState(false);

	const workers = [...stall.workers];

	const options = [
		{
			icon: IdentificationIcon,
			name: "Agregar Persona",
			action: () => setOpenAddWorker(true),
		},
		{
			icon: PencilSquareIcon,
			name: "Editar puesto",
			action: () => setOpenUpdate(true),
		},
		{
			icon: XMarkIcon,
			name: "Eliminar",
			action: () =>
				toast("Elminar puesto, turnos y eventos relacionados.", {
					action: {
						label: "Eliminar",
						onClick: () =>
							deleteStall(
								stall.id,
								shifts
									.filter(
										(shift) =>
											shift.stall === stall.id &&
											shiftTypes.includes(shift.type),
									)
									.map((shift) => shift.id),
								stalls,
							),
					},
				}),
		},
	];

	return (
		<Card className="bg-gray-50 p-2 mt-2">
			<header className="flex justify-between">
				<div className="flex gap-2 items-center">
					<Title color="sky">{stall.name}</Title>
					{stall.branch && (
						<Badge color="sky" size="xs">
							{stall.branch}
						</Badge>
					)}
					{stall.tag && (
						<Badge color="sky" size="xs" icon={TagIcon}>
							{stall.tag}
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-2">
					{validateRoles(profile.roles, [], ["handle_stalls"]) && (
						<Dropdown btnText="Acciones" position="right">
							{options.map((option) => (
								<DropdownItem
									key={option.name}
									icon={option.icon}
									onClick={option.action}
								>
									{option.name}
								</DropdownItem>
							))}
						</Dropdown>
					)}
				</div>
			</header>
			<main>
				<section className="grid gap-2 my-2 pt-2 border-t">
					<div className="flex justify-between items-center">
						<Title>Personal</Title>
						{validateRoles(profile.roles, [], ["handle_stalls"]) &&
							workers.length > 0 && (
								<Cog6ToothIcon
									className={classNames(
										deleteVisible ? "text-sky-500" : "text-gray-500",
										"w-5 h-5 hover:text-sky-600 cursor-pointer",
									)}
									onClick={() => setDeleteVisible(!deleteVisible)}
								/>
							)}
					</div>
					{workers.length === 0 && (
						<div className="col-span-2">
							<EmptyState>
								<IdentificationIcon className="w-10 h-10 text-sky-500" />
								<Text className="text-gray-600">
									No hay personal asignado a este puesto.
								</Text>
							</EmptyState>
						</div>
					)}
					{workers
						.sort((a, b) => {
							const nameA = a.name.toLowerCase();
							const nameB = b.name.toLowerCase();
							if (nameA < nameB) return -1;
							if (nameA > nameB) return 1;
							return 0;
						})
						.map((worker) => {
							return (
								<StallWorker
									key={worker.id}
									stall={stall}
									monthDays={monthDays}
									worker={worker}
									selectedWorkerId={selectedWorkerId}
									setSelectedWorkerId={setSelectedWorkerId}
									month={selectedMonth}
									year={selectedYear}
									deleteVisible={deleteVisible}
									removeWorker={removeWorker}
								/>
							);
						})}
				</section>
				<section className="grid grid-cols-2 gap-2 my-2 pt-2 border-t">
					<Title className="col-span-2">
						Dia {selectedDay} | Turnos, descansos y eventos.
					</Title>
					{shifts.length === 0 && (
						<div className="col-span-2">
							<EmptyState>
								<ShieldExclamationIcon className="w-10 h-10 text-sky-500" />
								<Text className="text-gray-600">
									No hay turnos, descansos o eventos que mostrar.
								</Text>
							</EmptyState>
						</div>
					)}
					{shifts
						.filter(
							(shift) =>
								shift.day.substring(0, 2) === selectedDay &&
								shift.stall === stall.id,
						)
						.sort((a, b) => {
							const nameA = a.workerName.toLowerCase();
							const nameB = b.workerName.toLowerCase();
							if (nameA < nameB) return -1;
							if (nameA > nameB) return 1;
							return 0;
						})
						.map((shift) => {
							const { minutes } = getDiference(shift.startTime, shift.endTime);
							return (
								<Card
									key={shift.id}
									className={`grid grid-cols-1 gap-1 p-2 border-2 border-${shift.color}-500 bg-${shift.color}-100 text-${shift.color}-700`}
								>
									<div className="grid grid-cols-3 gap-2">
										<p className="col-span-2 flex items-center text-sm font-medium text-left truncate">
											<IdentificationIcon className="w-5 h-5 mr-2" />
											{shift.workerName}
										</p>
										<span className="flex text-sm justify-end font-bold">
											{shift.day.substring(0, 5)}
										</span>
									</div>
									<div className="grid grid-cols-2 gap-2">
										<p className="text-sm text-left truncate font-bold">
											{shift.abbreviation} | {shift.startTime} - {shift.endTime}
										</p>
										<span className="flex text-sm justify-end font-bold">
											{minutesToString(minutes)}H
										</span>
									</div>
								</Card>
							);
						})}
				</section>
			</main>
			<CenteredModal
				open={openUpdate}
				setOpen={setOpenUpdate}
				icon={PencilSquareIcon}
				title="Editar puesto"
				btnText="Editar"
				action={() => handleUpdateStall(updateStall, stall.id)}
			>
				<HandleStall
					data={stallData}
					setData={setStallData}
					branches={actualCustomer?.branches || []}
				/>
			</CenteredModal>
			<CenteredModal
				open={openAddWorker}
				setOpen={setOpenAddWorker}
				icon={IdentificationIcon}
				title="Asignar persona"
				btnText="Asignar"
				action={() => handleAddWorker(addWorker, stall)}
			>
				<AddStallWorker
					position={position}
					setPosition={setPosition}
					selectedWorker={selectedWorker}
					setSelectedWorker={setSelectedWorker}
				/>
			</CenteredModal>
		</Card>
	);
}
