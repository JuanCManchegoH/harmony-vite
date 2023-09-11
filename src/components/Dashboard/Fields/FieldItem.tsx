import {
	DocumentTextIcon,
	PencilSquareIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../../common/CenteredModal";
import { Dropdown, DropdownItem } from "../../../common/DropDown";
import { useAppSelector } from "../../../hooks/store";
import { useFields, useHandleField } from "../../../hooks/useFields";
import { Field } from "../../../services/company/types";
import { validateRoles } from "../../../utils/roles";
import HandleField from "./HandleField";

const types = {
	text: "Texto",
	number: "Número",
	date: "Fecha",
	select: "Selección",
};

export default function FieldItem({
	field,
	type,
}: { field: Field; type: "customers" | "workers" }) {
	const { profile } = useAppSelector((state) => state.auth);
	const { updateField, deleteField } = useFields();
	const { data, setData, handleUpdateField } = useHandleField(field);
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
						onClick: () => deleteField(field.id, type),
					},
				}),
		},
	];

	return (
		<li className="flex justify-between py-2 bg-gray-50">
			<div className="flex items-center min-w-0 gap-x-4">
				<div className="min-w-0 flex-auto">
					<p className="text-sm font-semibold leading-6 text-gray-900">
						{field.name}
					</p>
					<p className="flex text-xs leading-5 text-gray-500">
						{types[field.type as keyof typeof types]} -{" "}
						{field.required ? "Requerido" : "Opcional"}
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
				icon={DocumentTextIcon}
				title={`Editar campo: ${field.name}`}
				btnText="Editar"
				action={() => handleUpdateField(updateField, type, field.id)}
			>
				<HandleField data={data} setData={setData} />
			</CenteredModal>
		</li>
	);
}
