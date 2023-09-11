import { XMarkIcon } from "@heroicons/react/24/outline";
import { ListBulletIcon, RectangleStackIcon } from "@heroicons/react/24/solid";
import { Badge, Button, Text, TextInput, Title } from "@tremor/react";
import { useState } from "react";
import CenteredModal from "../../../common/CenteredModal";
import EmptyState from "../../../common/EmptyState";
import SelectHours from "../../../common/SelectHours";
import { useAppSelector } from "../../../hooks/store";
import { useHandleSequences, useSequences } from "../../../hooks/useSequences";
import { Step } from "../../../services/company/types";
import { validateRoles } from "../../../utils/roles";
import SequenceItem from "./SequenceItem";

export default function Sequences() {
	const { roles } = useAppSelector((state) => state.auth.profile);
	const { sequences } = useAppSelector((state) => state.auth.profile.company);
	const { createSequence } = useSequences();
	const {
		times,
		setTimes,
		steps,
		setSteps,
		selectedColor,
		setSelectedColor,
		handleCreateSequence,
	} = useHandleSequences();
	const [openCreate, setOpenCreate] = useState(false);

	const getHour = (hour: string) => {
		if (hour.length === 1) {
			return `0${hour}`;
		}
		return hour;
	};
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

	return (
		<>
			<div className="flex space-x-2 items-center justify-between border-b pb-2 mb-2">
				<Title>Secuencias</Title>
				{validateRoles(roles, ["admin"], []) && (
					<Button
						variant="primary"
						onClick={() => setOpenCreate(true)}
						color="sky"
						size="xs"
					>
						Crear Secuencia
					</Button>
				)}
			</div>
			{sequences.length <= 0 && (
				<EmptyState>
					<ListBulletIcon className="w-8 h-8 text-sky-500" />
					<Text className="text-gray-600">
						Aquí aparecerán las secuencias agregadas
					</Text>
					<Text className="text-gray-400">
						Para agregar un campo, haz click en el botón "Agregar"
					</Text>
				</EmptyState>
			)}
			<ul className="divide-y divide-gray-200">
				{sequences.map((sequence) => (
					<SequenceItem key={sequence.id} sequence={sequence} />
				))}
			</ul>
			<CenteredModal
				open={openCreate}
				setOpen={setOpenCreate}
				icon={RectangleStackIcon}
				title="Crear Secuencia"
				btnText="Crear"
				action={() => handleCreateSequence(createSequence)}
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
						<div className="flex flex-wrap justify-center gap-2 mt-2">
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
		</>
	);
}
