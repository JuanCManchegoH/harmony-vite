import { RectangleGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
	Button,
	NumberInput,
	Select,
	SelectItem,
	TableCell,
	TableRow,
	TextInput,
} from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../../common/CenteredModal";
import { useAppSelector } from "../../../hooks/store";
import { useHandlePosition, usePositions } from "../../../hooks/usePositions";
import { Position } from "../../../services/company/types";
import formatCurrency from "../../../utils/formatCurrency";
import { validateRoles } from "../../../utils/roles";

const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];

export default function PositionItem({ position }: { position: Position }) {
	const { profile } = useAppSelector((state) => state.auth);
	const { updatePosition, deletePosition } = usePositions();
	const { data, setData, handleUpdatePosition } = useHandlePosition(position);
	const [update, setUpdate] = useState(false);

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
									onClick: () => deletePosition(position.id),
								},
							})
						}
					/>
				</TableCell>
			)}
			<TableCell className="py-2">{position.name}</TableCell>
			<TableCell className="hidden py-2 xl:table-cell">
				{formatCurrency(position.value)}
			</TableCell>
			<TableCell className="py-2">{position.year}</TableCell>
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
				icon={RectangleGroupIcon}
				title="Editar Cargo"
				btnText="Editar"
				action={() => handleUpdatePosition(updatePosition, position.id)}
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
			</CenteredModal>
		</TableRow>
	);
}
