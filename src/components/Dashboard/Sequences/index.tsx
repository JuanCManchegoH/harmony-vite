import { Switch } from "@headlessui/react";
import { ArrowsUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
	Badge,
	Button,
	Card,
	Select,
	SelectItem,
	Table,
	Text,
	TextInput,
	Title,
} from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "../../../hooks/store";
import { useSequences } from "../../../hooks/useSequences";
import { Step } from "../../../services/company/types";
import classNames from "../../../utils/classNames";
import { validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";
import SequenceItem from "./SequenceItem";

export default function Sequences() {
	const profile = useAppSelector((state) => state.auth.profile);
	const { createSequence } = useSequences();
	const [openCreate, setOpenCreate] = useState(false);
	const [steps, setSteps] = useState<Step[]>([]);
	const [isShift, setIsShift] = useState<boolean>(true);
	const [data, setData] = useState({
		name: "",
		selectedStartHour: "6",
		selectedStartMinute: "0",
		selectedEndHour: "18",
		selectedEndMinute: "0",
	});

	const resetForm = () => {
		setData({
			name: "",
			selectedStartHour: "6",
			selectedStartMinute: "0",
			selectedEndHour: "18",
			selectedEndMinute: "0",
		});
		setSteps([]);
	};
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

	const handleCreateSequence = () => {
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
		createSequence(sequenceData).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	return (
		<Card className="px-4 py-0 overflow-auto">
			<div className="flex space-x-2 items-center justify-between border-b pb-2 sticky top-0 bg-white pt-4">
				<Title>Secuencias</Title>
				{validateRoles(profile.roles, ["admin"], []) && (
					<Button
						variant="primary"
						onClick={() => setOpenCreate(true)}
						color="sky"
					>
						Crear Secuencia
					</Button>
				)}
			</div>
			<Table className="w-full">
				{profile.company.sequences.map((sequence) => (
					<SequenceItem key={sequence.id} sequence={sequence} />
				))}
			</Table>
			<Modal
				open={openCreate}
				setOpen={setOpenCreate}
				title="Crear Secuencia"
				btnText="Crear"
				action={handleCreateSequence}
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
		</Card>
	);
}
