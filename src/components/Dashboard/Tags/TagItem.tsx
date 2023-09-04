import { TagIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
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
import CenteredModal from "../../../common/CenteredModal";
import { useAppSelector } from "../../../hooks/store";
import { useHandleTags, useTags } from "../../../hooks/useTags";
import { Tag } from "../../../services/company/types";
import { validateRoles } from "../../../utils/roles";

export default function TagItem({ tag }: { tag: Tag }) {
	const profile = useAppSelector((state) => state.auth.profile);
	const { deleteTag, updateTag } = useTags();
	const { scopes, data, setData, handleUpdateTag } = useHandleTags(tag);
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
									onClick: () => deleteTag(tag.id),
								},
							})
						}
					/>
				</TableCell>
			)}
			<TableCell className="py-2">{tag.name}</TableCell>
			<TableCell className="py-2">
				{scopes.find((s) => s.name === tag.scope)?.value}
			</TableCell>
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
		</TableRow>
	);
}
