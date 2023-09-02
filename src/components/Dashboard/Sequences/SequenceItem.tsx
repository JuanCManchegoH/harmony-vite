import {
	ListBulletIcon,
	RectangleStackIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import {
	Badge,
	Button,
	TableCell,
	TableRow,
	Text,
	TextInput,
} from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../../common/CenteredModal";
import EmptyState from "../../../common/EmptyState";
import SelectHours from "../../../common/SelectHours";
import { useAppSelector } from "../../../hooks/store";
import { useHandleSequences, useSequences } from "../../../hooks/useSequences";
import { Sequence, Step } from "../../../services/company/types";
import { getHour } from "../../../utils/hours";
import { validateRoles } from "../../../utils/roles";

export default function SequenceItem({ sequence }: { sequence: Sequence }) {
	const profile = useAppSelector((state) => state.auth.profile);
	const { updateSequence, deleteSequence } = useSequences();
	const {
		times,
		setTimes,
		steps,
		setSteps,
		isShift,
		setIsShift,
		handleUpdateSequence,
	} = useHandleSequences(sequence);
	const [update, setUpdate] = useState(false);

	const addStep = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if (
			!times.selectedStartHour ||
			!times.selectedStartMinute ||
			!times.selectedEndHour ||
			!times.selectedEndMinute
		) {
			return;
		}
		const step: Step = {
			startTime: isShift
				? `${getHour(times.selectedStartHour)}:${getHour(
						times.selectedStartMinute,
				  )}`
				: "00:00",
			endTime: isShift
				? `${getHour(times.selectedEndHour)}:${getHour(
						times.selectedEndMinute,
				  )}`
				: "00:00",
			color: isShift ? "green" : "gray",
		};
		setSteps([...steps, step]);
	};

	const removeStep = (idx: number) => {
		const newSteps = steps.filter((_, i) => i !== idx);
		setSteps(newSteps);
	};

	return (
		<TableRow className="uppercase border-b">
			{validateRoles(profile.roles, ["admin"], []) && (
				<TableCell className="pl-0 py-2">
					<XMarkIcon
						className="w-5 h-5 cursor-pointer hover:text-red-500"
						onClick={() =>
							toast("Confirmar acción", {
								action: {
									label: "Eliminar",
									onClick: () => deleteSequence(sequence.id),
								},
							})
						}
					/>
				</TableCell>
			)}
			<TableCell className="py-2">{sequence.name}</TableCell>
			<TableCell className="py-2">{sequence.steps.length}</TableCell>
			{validateRoles(profile.roles, ["admin"], []) && (
				<TableCell className="flex justify-end pr-0 py-2">
					<Button
						variant="secondary"
						onClick={() => setUpdate(true)}
						color="sky"
						size="xs"
					>
						Editar
					</Button>
				</TableCell>
			)}
			<CenteredModal
				open={update}
				setOpen={setUpdate}
				icon={RectangleStackIcon}
				title="Editar Secuencia"
				btnText="Editar"
				action={() => handleUpdateSequence(updateSequence, sequence.id)}
			>
				<form className="grid grid-cols-2 gap-2">
					<TextInput
						className="col-span-2"
						placeholder="Nombre*"
						value={times.name}
						onChange={(e) => setTimes({ ...times, name: e.target.value })}
					/>
					<SelectHours
						times={times}
						setTimes={setTimes}
						isShift={isShift}
						setIsShift={setIsShift}
					/>
					<Button
						color="sky"
						size="xs"
						onClick={(e) => addStep(e)}
						className="col-start-2"
					>
						Agregar
					</Button>
					<div className="col-span-2">
						<h1 className="text-sm font-bold">Secuencia</h1>
						<div className="flex flex-wrap gap-2 mt-2">
							{steps.length <= 0 && (
								<EmptyState>
									<ListBulletIcon className="w-8 h-8 text-sky-500" />
									<Text className="text-gray-600">
										Aquí aparecerán los turnos y descansos agregados
									</Text>
									<Text className="text-gray-400">
										Para agregar un paso, haz click en el botón "Agregar"
									</Text>
								</EmptyState>
							)}
							{steps.map((step, i) => (
								<Badge
									key={`${step.startTime}-${step.endTime}-${i}`}
									color={step.color}
								>
									<span className="flex items-center gap-1">
										<span className="text-xs">
											{step.startTime === "00:00" && step.endTime === "00:00"
												? "Descanso"
												: `${step.startTime} - ${step.endTime}`}
										</span>
										<XMarkIcon
											className="w-4 h-4 cursor-pointer"
											onClick={() => removeStep(i)}
										/>
									</span>
								</Badge>
							))}
						</div>
					</div>
				</form>
			</CenteredModal>
		</TableRow>
	);
}
