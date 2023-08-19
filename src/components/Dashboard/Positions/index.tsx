import {
	Button,
	Card,
	List,
	NumberInput,
	Select,
	SelectItem,
	Text,
	TextInput,
	Title,
} from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "../../../hooks/store";
import { usePositions } from "../../../hooks/usePositions";
import { validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";
import PositionItem from "./PositionItem";

const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];

export default function Positions() {
	const profile = useAppSelector((state) => state.auth.profile);
	const { createPosition } = usePositions();
	const [openCreate, setOpenCreate] = useState(false);
	const [data, setData] = useState({
		name: "",
		value: 0,
		year: years[1],
	});

	const resetForm = () => {
		setData({
			name: "",
			value: 0,
			year: years[1],
		});
	};

	const handleCreatePosition = () => {
		if (!data.name || !data.year) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		const positionData = {
			...data,
			year: parseInt(data.year),
			value: data.value || 0,
		};
		createPosition(positionData).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	return (
		<Card className="p-4 overflow-auto">
			<div className="flex space-x-2 items-center justify-between border-b pb-2">
				<Title>Cargos</Title>
				{validateRoles(profile.roles, ["admin"], []) && (
					<Button
						variant="primary"
						onClick={() => setOpenCreate(true)}
						color="sky"
					>
						Crear Cargo
					</Button>
				)}
			</div>
			<List>
				{profile.company.positions.map((position) => (
					<PositionItem key={position.id} position={position} />
				))}
			</List>
			<Modal
				open={openCreate}
				setOpen={setOpenCreate}
				title="Crear Cargo"
				btnText="Crear"
				action={handleCreatePosition}
			>
				<form className="grid grid-cols-2 gap-2">
					<TextInput
						className="col-span-2"
						type="text"
						placeholder="Nombre del cargo*"
						value={data.name}
						onChange={(e) => setData({ ...data, name: e.target.value })}
					/>
					<NumberInput
						placeholder="Valor"
						min={0}
						value={data.value}
						onValueChange={(value) => setData({ ...data, value })}
					/>
					<Select
						placeholder="Año*"
						value={data.year}
						onValueChange={(value) => setData({ ...data, year: value })}
					>
						{years.map((year) => (
							<SelectItem key={year} value={year}>
								{year}
							</SelectItem>
						))}
					</Select>
					<Text className="col-span-2 text-justify">
						Tenga en cuenta que el valor del cargo se multiplicará por el número
						de horas de los turnos adicionales, si el valor es 0, no se sumará
						en el reporte de turnos adicionales.
					</Text>
				</form>
			</Modal>
		</Card>
	);
}
