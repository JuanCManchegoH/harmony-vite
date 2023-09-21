import CenteredModal from "../../common/CenteredModal";
import { useAppSelector } from "../../hooks/store";
import {
	useHandleCreateAndUpdate,
	useHandleDeleteShifts,
	useHandleSequence,
} from "../../hooks/useShifts";
import { shiftTypes } from "../../services/shifts/types";
import {
	StallWithId,
	StallWorker as StallWorkerType,
} from "../../services/stalls/types";
import { MonthDay } from "../../utils/dates";
import { validateRoles } from "../../utils/roles";
import CalendarUpdate from "./CalendarUpdate";
import DeleteShifts from "./DeleteShifts";
import SelectSequence from "./SelectSequence";
import WorkerInfo from "./WorkerInfo";
// import { useHandleShifts, useShifts } from "../../hooks/useShifts";
import {
	BackspaceIcon,
	BoltIcon,
	CalendarDaysIcon,
	IdentificationIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { Badge, Button, Card } from "@tremor/react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export default function StallWorker({
	stall,
	monthDays,
	worker,
	selectedWorkerId,
	setSelectedWorkerId,
	month,
	year,
	deleteVisible,
	removeWorker,
}: {
	stall: StallWithId;
	monthDays: MonthDay[];
	worker: StallWorkerType;
	selectedWorkerId: string;
	setSelectedWorkerId: Dispatch<SetStateAction<string>>;
	month: string;
	year: string;
	deleteVisible: boolean;
	removeWorker: (
		stallId: string,
		workerId: string,
		workerShifts: string[],
	) => void;
}) {
	const { profile } = useAppSelector((state) => state.auth);
	const { stalls } = useAppSelector((state) => state.stalls);
	const { shifts } = useAppSelector((state) => state.shifts);
	const createAndUpdate = useHandleCreateAndUpdate(
		stalls,
		shifts,
		worker,
		stall,
		month,
		year,
	);
	const handleSequence = useHandleSequence(
		stalls,
		shifts,
		worker,
		stall,
		monthDays,
		month,
		year,
	);
	const handleDeleteShifts = useHandleDeleteShifts(stalls, shifts);

	const [openWorkerInfo, setOpenWorkerInfo] = useState(false);
	const [openCalendar, setOpenCalendar] = useState(false);
	const [openSequence, setOpenSequence] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const workerShifts =
		shifts.filter((shift) => shift.worker === worker.id) || [];
	const workerStallShifts =
		workerShifts.filter(
			(shift) => shift.stall === stall.id && shiftTypes.includes(shift.type),
		) || [];
	const handleSelectWorker = (id: string) => {
		selectedWorkerId === id ? setSelectedWorkerId("") : setSelectedWorkerId(id);
	};

	return (
		<Card
			decoration="left"
			decorationColor="sky"
			className="grid grid-cols-2 gap-1 p-2"
		>
			<p className="text-sm font-medium text-left truncate">
				<Button
					icon={selectedWorkerId === worker.id ? XMarkIcon : undefined}
					color="sky"
					size="xs"
					onClick={() => handleSelectWorker(worker.id)}
				>
					{worker.name}
				</Button>
			</p>
			<p className="flex justify-end gap-2 text-sm font-medium text-left truncate">
				{!deleteVisible && (
					<IdentificationIcon
						className="w-5 h-5 text-gray-500 hover:text-sky-400 cursor-pointer"
						onClick={() => setOpenWorkerInfo(true)}
					/>
				)}
				{validateRoles(profile.roles, [], ["handle_stalls"]) && (
					<>
						{!deleteVisible && (
							<>
								<CalendarDaysIcon
									className="w-5 h-5 text-gray-500 hover:text-sky-400 cursor-pointer"
									onClick={() => setOpenCalendar(true)}
								/>
								<BoltIcon
									className="w-5 h-5 text-gray-500 hover:text-sky-400 cursor-pointer"
									onClick={() => setOpenSequence(true)}
								/>
								<BackspaceIcon
									className="w-5 h-5 text-gray-500 hover:text-sky-400 cursor-pointer"
									onClick={() => setOpenDelete(true)}
								/>
							</>
						)}
						{deleteVisible && (
							<XMarkIcon
								className="w-5 h-5 text-gray-500 hover:text-sky-400 cursor-pointer"
								onClick={() =>
									toast("Confirmar eliminacion", {
										action: {
											label: "Eliminar",
											onClick: () =>
												removeWorker(
													stall.id,
													worker.id,
													workerStallShifts.map((shift) => shift.id),
												),
										},
									})
								}
							/>
						)}
					</>
				)}
			</p>
			<Badge color="sky" className="text-sm font-medium truncate">
				{worker.position} | {worker.identification}
			</Badge>
			<CenteredModal
				open={openWorkerInfo}
				setOpen={setOpenWorkerInfo}
				icon={IdentificationIcon}
				title="Información de la persona"
			>
				<WorkerInfo worker={worker} shifts={workerShifts} />
			</CenteredModal>
			<CenteredModal
				open={openCalendar}
				setOpen={setOpenCalendar}
				icon={CalendarDaysIcon}
				title="Actualización por calendario"
				btnText="Actualizar"
				action={() => createAndUpdate.handleCreateAndUpdate()}
			>
				<CalendarUpdate
					monthDays={monthDays}
					selectedDays={createAndUpdate.selectedDays}
					setSelectedDays={createAndUpdate.setSelectedDays}
					data={createAndUpdate.shiftsData}
					setData={createAndUpdate.setShiftsData}
					selectedConvention={createAndUpdate.selectedConvention}
					setSelectedConvention={createAndUpdate.setSelectedConvention}
				/>
			</CenteredModal>
			<CenteredModal
				open={openSequence}
				setOpen={setOpenSequence}
				icon={BoltIcon}
				title="Secuencias"
				btnText="Actualizar"
				action={() => handleSequence.handleSequence()}
			>
				<form className="grid grid-cols-2 gap-2">
					<SelectSequence
						monthDays={monthDays}
						selectedSequence={handleSequence.selectedSequence}
						setSelectedSequence={handleSequence.setSelectedSequence}
						selectedIndex={handleSequence.selectedIndex}
						setSelectedIndex={handleSequence.setSelectedIndex}
						jump={handleSequence.jump}
						setJump={handleSequence.setJump}
					/>
				</form>
			</CenteredModal>
			<CenteredModal
				open={openDelete}
				setOpen={setOpenDelete}
				icon={BackspaceIcon}
				title="Eliminar Turnos"
				btnText="Eliminar"
				action={() => handleDeleteShifts.handleDeleteShifts(stall.id)}
			>
				<DeleteShifts
					shifts={[...workerShifts]}
					selectedDelete={handleDeleteShifts.selectedDelete}
					setSelectedDelete={handleDeleteShifts.setSelectedDelete}
					month={month}
					year={year}
				/>
			</CenteredModal>
		</Card>
	);
}
