import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Select, SelectItem, Text, TextInput } from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../../common/CenteredModal";
import { Dropdown, DropdownItem } from "../../../common/DropDown";
import Toggle from "../../../common/Toggle";
import { useAppSelector } from "../../../hooks/store";
import {
	useConventions,
	useHandleConventions,
} from "../../../hooks/useConventions";
import { Convention } from "../../../services/company/types";
import { conventionsColors } from "../../../utils/colors";
import { validateRoles } from "../../../utils/roles";

export default function ConventionItem({
	convention,
}: { convention: Convention }) {
	const { profile } = useAppSelector((state) => state.auth);
	const { deleteConvention, updateConvention } = useConventions();
	const { data, setData, handleUpdateConvention } =
		useHandleConventions(convention);
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
						onClick: () => deleteConvention(convention.id),
					},
				}),
		},
	];

	return (
		<li className="flex justify-between py-2 bg-gray-50">
			<div className="flex items-center min-w-0 gap-x-4">
				<div className="min-w-0 flex-auto">
					<p className="text-sm font-semibold leading-6 text-gray-900">
						{convention.name}
					</p>
					<p
						className={`flex text-xs leading-5 font-semibold text-${
							conventionsColors.find((c) => c.value === convention.color)?.value
						}-500`}
					>
						{conventionsColors.find((c) => c.value === convention.color)?.name}
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
				title="Editar Convención"
				btnText="Editar"
				action={() => handleUpdateConvention(updateConvention, convention.id)}
			>
				<form className="grid grid-cols-2 gap-2">
					<TextInput
						className="col-span-2"
						placeholder="Nombre"
						maxLength={20}
						value={data.name}
						onChange={(e) => setData({ ...data, name: e.target.value })}
					/>
					<TextInput
						placeholder="Abreviatura"
						maxLength={2}
						value={data.abbreviation}
						onChange={(e) => setData({ ...data, abbreviation: e.target.value })}
					/>
					<Select
						placeholder="Grupo"
						value={data.color}
						onValueChange={(value) =>
							setData({ ...data, color: value as "sky" | "red" })
						}
					>
						{conventionsColors.map((color) => (
							<SelectItem key={color.name} value={color.value}>
								{color.name}
							</SelectItem>
						))}
					</Select>
					<Text className="col-span-2 text-justify">
						Las abreviaturas deben tener máximo 2 caracteres.
					</Text>
					<div className="col-span-2 text-left">
						<Toggle
							enabled={data.keep}
							setEnabled={() => setData({ ...data, keep: !data.keep })}
							label="Activar Sugerencia"
							description="Al desactivar el personal marcado con la comvencion no sera sugerido"
						/>
					</div>
				</form>
			</CenteredModal>
		</li>
	);
}
