import { ListBulletIcon, TagIcon } from "@heroicons/react/24/solid";
import {
	Button,
	Select,
	SelectItem,
	Text,
	TextInput,
	Title,
} from "@tremor/react";
import { useState } from "react";
import CenteredModal from "../../../common/CenteredModal";
import EmptyState from "../../../common/EmptyState";
import { useAppSelector } from "../../../hooks/store";
import { useHandleTags, useTags } from "../../../hooks/useTags";
import { validateRoles } from "../../../utils/roles";
import TagItem from "./TagItem";

export default function Tags() {
	const { roles } = useAppSelector((state) => state.auth.profile);
	const { tags } = useAppSelector((state) => state.auth.profile.company);
	const { createTag } = useTags();
	const { scopes, data, setData, handleCreate } = useHandleTags();
	const [openCreate, setOpenCreate] = useState(false);

	return (
		<>
			<div className="flex space-x-2 items-center justify-between border-b pb-2 mb-2">
				<Title>Etiquetas</Title>
				{validateRoles(roles, ["admin"], []) && (
					<Button
						variant="primary"
						color="sky"
						onClick={() => setOpenCreate(true)}
						size="xs"
					>
						Crear Etiqueta
					</Button>
				)}
			</div>
			{tags.length <= 0 && (
				<EmptyState>
					<ListBulletIcon className="w-8 h-8 text-sky-500" />
					<Text className="text-gray-600">
						Aquí aparecerán las etiquetas agregadas
					</Text>
					<Text className="text-gray-400">
						Para agregar un campo, haz click en el botón "Agregar"
					</Text>
				</EmptyState>
			)}
			<ul className="divide-y divide-gray-200">
				{tags
					.slice()
					.sort((a, b) => a.scope.localeCompare(b.scope))
					.map((tag) => (
						<TagItem key={tag.id} tag={tag} />
					))}
			</ul>
			<CenteredModal
				open={openCreate}
				setOpen={setOpenCreate}
				icon={TagIcon}
				title="Crear Etiqueta"
				btnText="Crear"
				action={() => handleCreate(createTag)}
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
		</>
	);
}
