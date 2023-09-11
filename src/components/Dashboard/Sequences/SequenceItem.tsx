import {
	ListBulletIcon,
	PencilSquareIcon,
	RectangleStackIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { Badge, Button, Text, TextInput } from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../../common/CenteredModal";
import { Dropdown, DropdownItem } from "../../../common/DropDown";
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
		selectedColor,
		setSelectedColor,
		handleUpdateSequence,
	} = useHandleSequences(sequence);
	const [openUpdate, setOpenUpdate] = useState(false);

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
			startTime:
				selectedColor.name === "Descanso"
					? "00:00"
					: `${getHour(times.selectedStartHour)}:${getHour(
							times.selectedStartMinute,
					  )}`,
			endTime:
				selectedColor.name === "Descanso"
					? "00:00"
					: `${getHour(times.selectedEndHour)}:${getHour(
							times.selectedEndMinute,
					  )}`,
			color: selectedColor.color,
		};
		setSteps([...steps, step]);
	};

	const removeStep = (idx: number) => {
		const newSteps = steps.filter((_, i) => i !== idx);
		setSteps(newSteps);
	};

	const options = [
		{
			icon: PencilSquareIcon,
			name: "Editar",
			action: () => setOpenUpdate(true),
		},
		{
			icon: XMarkIcon,
			name: "Eliminar",
			action: () =>
				toast("Confirmar acción", {
					action: {
						label: "Eliminar",
						onClick: () => deleteSequence(sequence.id),
					},
				}),
		},
	];

	return (
		<li className="flex justify-between py-2 bg-gray-50">
			<div className="flex items-center min-w-0 gap-x-4">
				<div className="min-w-0 flex-auto">
					<p className="text-sm font-semibold leading-6 text-gray-900">
						{sequence.name}
					</p>
					<p className="flex text-xs leading-5 text-gray-500">
						{sequence.steps.length} pasos
					</p>
				</div>
			</div>
			{validateRoles(profile.roles, ["admin"], []) && (
				<Dropdown btnText="Gestionar" position="right">
					{options

					.map((option) => (
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
			<CenteredModal
				open={openUpdate}
				setOpen={setOpenUpdate}
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
						selectedColor={selectedColor}
						setSelectedColor={setSelectedColor}
					/>
					<div className="col-span-2 flex justify-end">
						<Button color="sky" size="xs" onClick={(e) => addStep(e)}>
							Agregar
						</Button>
					</div>
					<div className="col-span-2">
						<h1 className="text-sm font-bold">Secuencia</h1>
						<div className="flex flex-wrap gap-2 mt-2 justify-center">
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
									size="xl"
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
		</li>
	);
}
