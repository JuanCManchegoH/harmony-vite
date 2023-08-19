import { Switch } from "@headlessui/react";
import { ArrowsUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
	Badge,
	Button,
	Select,
	SelectItem,
	TableCell,
	TableRow,
	Text,
	TextInput,
} from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "../../../hooks/store";
import { useSequences } from "../../../hooks/useSequences";
import { Sequence, Step } from "../../../services/company/types";
import classNames from "../../../utils/classNames";
import { validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";

export default function SequenceItem({ sequence }: { sequence: Sequence }) {
	const profile = useAppSelector((state) => state.auth.profile);
	const { updateSequence, deleteSequence } = useSequences();
	const [update, setUpdate] = useState(false);
	const [steps, setSteps] = useState<Step[]>(sequence.steps);
	const [isShift, setIsShift] = useState<boolean>(true);

	const [data, setData] = useState({
		name: sequence.name,
		selectedStartHour: "6",
		selectedStartMinute: "0",
		selectedEndHour: "18",
		selectedEndMinute: "0",
	});

	const hours = Array.from(Array(25).keys()).slice(1);
	const minutes = Array.from(Array(61).keys());

	const getHour = (hour: string) => {
		if (hour.length === 1) {
			return `0${hour}`;
		}
		return hour;
	};

	const addStep = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if (
			!data.selectedStartHour ||
			!data.selectedStartMinute ||
			!data.selectedEndHour ||
			!data.selectedEndMinute
		) {
			return;
		}
		const step: Step = {
			startTime: isShift
				? `${getHour(data.selectedStartHour)}:${getHour(
						data.selectedStartMinute,
				  )}`
				: "00:00",
			endTime: isShift
				? `${getHour(data.selectedEndHour)}:${getHour(data.selectedEndMinute)}`
				: "00:00",
			color: isShift ? "green" : "gray",
		};
		setSteps([...steps, step]);
	};

	const removeStep = (idx: number) => {
		const newSteps = steps.filter((_, i) => i !== idx);
		setSteps(newSteps);
	};

	const exchange = () => {
		setData({
			...data,
			selectedStartHour: data.selectedEndHour,
			selectedStartMinute: data.selectedEndMinute,
			selectedEndHour: data.selectedStartHour,
			selectedEndMinute: data.selectedStartMinute,
		});
	};

	const handleUpdateSequence = () => {
		if (!data.name) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		if (steps.length < 2) {
			toast.error("Debe agregar al menos dos pasos");
			return;
		}
		const sequenceData = {
			name: data.name,
			steps,
		};

		updateSequence(sequenceData, sequence.id).then((res) => {
			if (res) {
				setUpdate(false);
			}
		});
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
			<Modal
				open={update}
				setOpen={setUpdate}
				title="Editar Secuencia"
				btnText="Editar"
				action={handleUpdateSequence}
			>
				<form className="grid grid-cols-2 gap-2">
					<TextInput
						className="col-span-2"
						placeholder="Nombre*"
						value={data.name}
						onChange={(e) => setData({ ...data, name: e.target.value })}
					/>
					<div className="col-span-2 flex items-center justify-end relative">
						<Text className="absolute left-0">Hora de Inicio</Text>
						<Badge color={isShift ? "green" : "gray"} size="xs">
							{isShift
								? `${getHour(data.selectedStartHour)}:${getHour(
										data.selectedStartMinute,
								  )}`
								: "Descanso"}
						</Badge>
					</div>
					<div className="col-span-2 flex gap-2">
						<Select
							className="w-full"
							disabled={!isShift}
							placeholder="Hora inicio"
							value={data.selectedStartHour}
							onValueChange={(value) =>
								setData({ ...data, selectedStartHour: value })
							}
						>
							{hours.map((hour) => (
								<SelectItem key={hour} value={hour.toString()}>
									{hour}
								</SelectItem>
							))}
						</Select>
						<Select
							className="w-full"
							disabled={!isShift}
							placeholder="Minuto inicio"
							value={data.selectedStartMinute}
							onValueChange={(value) =>
								setData({ ...data, selectedStartMinute: value })
							}
						>
							{minutes.map((minute) => (
								<SelectItem key={minute} value={minute.toString()}>
									{minute}
								</SelectItem>
							))}
						</Select>
					</div>
					<div className="col-span-2 flex items-center justify-end relative">
						<Text className="absolute left-0">Hora de Fin</Text>
						<Badge color={isShift ? "green" : "gray"} size="xs">
							{isShift
								? `${getHour(data.selectedEndHour)}:${getHour(
										data.selectedEndMinute,
								  )}`
								: "Descanso"}
						</Badge>
					</div>

					<div className="col-span-2 flex gap-2">
						<Select
							className="w-full"
							disabled={!isShift}
							placeholder="Hora fin"
							value={data.selectedEndHour}
							onValueChange={(value) =>
								setData({ ...data, selectedEndHour: value })
							}
						>
							{hours.map((hour) => (
								<SelectItem key={hour} value={hour.toString()}>
									{hour}
								</SelectItem>
							))}
						</Select>
						<Select
							className="w-full"
							disabled={!isShift}
							placeholder="Minuto fin"
							value={data.selectedEndMinute}
							onValueChange={(value) =>
								setData({ ...data, selectedEndMinute: value })
							}
						>
							{minutes.map((minute) => (
								<SelectItem key={minute} value={minute.toString()}>
									{minute}
								</SelectItem>
							))}
						</Select>
					</div>
					<Switch.Group
						as="div"
						className="flex items-center justify-between col-span-2"
					>
						<span className="flex flex-grow flex-col">
							<Switch.Label
								as="span"
								className="text-sm font-medium leading-6 text-gray-900"
								passive
							>
								Turno
							</Switch.Label>
							<Switch.Description as="span" className="text-sm text-gray-500">
								Si se desactiva se considera como descanso
							</Switch.Description>
						</span>
						<Switch
							checked={isShift}
							onChange={() => setIsShift(!isShift)}
							className={classNames(
								isShift ? "bg-sky-500" : "bg-gray-200",
								"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
							)}
						>
							<span
								className={classNames(
									isShift ? "translate-x-5" : "translate-x-0",
									"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
								)}
							>
								<span
									className={classNames(
										isShift
											? "opacity-0 duration-100 ease-out"
											: "opacity-100 duration-200 ease-in",
										"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
									)}
									aria-hidden="true"
								>
									<svg
										className="h-3 w-3 text-gray-400"
										fill="none"
										viewBox="0 0 12 12"
									>
										<title>Off</title>
										<path
											d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
								<span
									className={classNames(
										isShift
											? "opacity-100 duration-200 ease-in"
											: "opacity-0 duration-100 ease-out",
										"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
									)}
									aria-hidden="true"
								>
									<svg
										className="h-3 w-3 text-sky-500"
										fill="currentColor"
										viewBox="0 0 12 12"
									>
										<title>On</title>
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</Switch.Group>
					<div className="flex items-center">
						<ArrowsUpDownIcon
							title="Intercambiar horas"
							className="w-5 h-5 cursor-pointer hover:text-sky-500"
							onClick={() => exchange()}
						/>
					</div>
					<Button color="sky" size="xs" onClick={(e) => addStep(e)}>
						Agregar
					</Button>
					<div className="col-span-2">
						<h1 className="text-sm font-bold">Secuencia</h1>
						<div className="flex flex-wrap gap-2 mt-2">
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
			</Modal>
		</TableRow>
	);
}
