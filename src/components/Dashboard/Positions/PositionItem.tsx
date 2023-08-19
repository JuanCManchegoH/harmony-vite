import { XMarkIcon } from "@heroicons/react/24/solid";
import {
	Button,
	ListItem,
	NumberInput,
	Select,
	SelectItem,
	TextInput,
} from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "../../../hooks/store";
import { usePositions } from "../../../hooks/usePositions";
import { Position } from "../../../services/company/types";
import formatCurrency from "../../../utils/formatCurrency";
import { validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";

const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];

export default function PositionItem({ position }: { position: Position }) {
	const { profile } = useAppSelector((state) => state.auth);
	const { updatePosition, deletePosition } = usePositions();
	const [update, setUpdate] = useState(false);
	const [data, setData] = useState({
		name: position.name,
		value: position.value,
		year: position.year.toString(),
	});

	const handleUpdatePosition = () => {
		if (!data.name || !data.year) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		const positionData = {
			...data,
			year: parseInt(data.year),
			value: data.value || 0,
		};
		updatePosition(positionData, position.id).then((res) => {
			if (res) {
				setUpdate(false);
			}
		});
	};

	return (
		<ListItem>
			{validateRoles(profile.roles, ["admin"], []) && (
				<div className="flex space-x-2">
					<XMarkIcon
						className="w-5 h-5 cursor-pointer hover:text-red-500"
						onClick={() =>
							toast("Confirmar acción", {
								action: {
									label: "Eliminar",
									onClick: () => deletePosition(position.id),
								},
							})
						}
					/>
				</div>
			)}
			<span>{position.name}</span>
			<span>{formatCurrency(position.value)}</span>
			<span>{position.year}</span>
			{validateRoles(profile.roles, ["admin"], []) && (
				<Button
					variant="secondary"
					onClick={() => setUpdate(true)}
					color="sky"
					size="xs"
				>
					Editar
				</Button>
			)}
			<Modal
				open={update}
				setOpen={setUpdate}
				title="Editar Cargo"
				btnText="Editar"
				action={handleUpdatePosition}
			>
				<form className="grid grid-cols-2 gap-2">
					<TextInput
						className="col-span-2"
						type="text"
						placeholder="Nombre"
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
						placeholder="Año"
						value={data.year}
						onValueChange={(value) => setData({ ...data, year: value })}
					>
						{years.map((year) => (
							<SelectItem key={year} value={year}>
								{year}
							</SelectItem>
						))}
					</Select>
				</form>
			</Modal>
		</ListItem>
	);
}
