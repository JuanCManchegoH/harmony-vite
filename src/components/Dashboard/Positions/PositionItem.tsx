import {
	PencilSquareIcon,
	RectangleGroupIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../../common/CenteredModal";
import { Dropdown, DropdownItem } from "../../../common/DropDown";
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
	const [openUpdate, setOpenUpdate] = useState(false);

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
						onClick: () => deletePosition(position.id),
					},
				}),
		},
	];

	return (
		<li className="flex justify-between py-2 bg-gray-50">
			<div className="flex items-center min-w-0 gap-x-4">
				<div className="min-w-0 flex-auto">
					<p className="text-sm font-semibold leading-6 text-gray-900">
						{position.name}
					</p>
					<p className="flex text-xs leading-5 text-gray-500">
						{formatCurrency(position.value)} - {position.year}
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
		</li>
	);
}
