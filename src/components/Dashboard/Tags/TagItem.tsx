import {
	PencilSquareIcon,
	TagIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { Select, SelectItem, Text, TextInput } from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../../common/CenteredModal";
import { Dropdown, DropdownItem } from "../../../common/DropDown";
import { useAppSelector } from "../../../hooks/store";
import { useHandleTags, useTags } from "../../../hooks/useTags";
import { Tag } from "../../../services/company/types";
import { validateRoles } from "../../../utils/roles";

export default function TagItem({ tag }: { tag: Tag }) {
	const profile = useAppSelector((state) => state.auth.profile);
	const { deleteTag, updateTag } = useTags();
	const { scopes, data, setData, handleUpdateTag } = useHandleTags(tag);
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
						onClick: () => deleteTag(tag.id),
					},
				}),
		},
	];

	return (
		<li className="flex justify-between py-2 bg-gray-50">
			<div className="flex items-center min-w-0 gap-x-4">
				<div className="min-w-0 flex-auto">
					<p className="text-sm font-semibold leading-6 text-gray-900">
						{tag.name}
					</p>
					<p className="flex text-xs leading-5 text-gray-500">
						{scopes.find((s) => s.name === tag.scope)?.value}
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
				icon={TagIcon}
				title="Editar Etiqueta"
				btnText="Editar"
				action={() => handleUpdateTag(updateTag, tag.id)}
			>
				<div className="grid grid-cols-2 gap-2">
					<TextInput
						placeholder="Nombre"
						maxLength={7}
						value={data.name}
						onChange={(e) => setData({ ...data, name: e.target.value })}
					/>
					<Select
						placeholder="Grupo"
						value={data.scope}
						onValueChange={(value) => setData({ ...data, scope: value })}
					>
						{scopes.map((scope) => (
							<SelectItem key={scope.name} value={scope.name}>
								{scope.value}
							</SelectItem>
						))}
					</Select>
					<Text className="col-span-2 text-justify">
						Estas etiquetas, en el caso de los clientes y personal, ayuda a
						gestionar los permisos de acceso. En caso de los puestos permite
						agregar información adicional.
					</Text>
				</div>
			</CenteredModal>
		</li>
	);
}
