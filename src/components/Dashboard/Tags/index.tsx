import {
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
import { useTags } from "../../../hooks/useTags";
import { validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";
import TagItem from "./TagItem";

const scopes = [
	{ name: "stalls", value: "Puestos" },
	{ name: "customers", value: "Clientes" },
	{ name: "workers", value: "Personal" },
];

export default function Tags() {
	const profile = useAppSelector((state) => state.auth.profile);
	const { createTag } = useTags();
	const [openCreate, setOpenCreate] = useState(false);
	const [data, setData] = useState({
		name: "",
		color: "gray",
		scope: scopes[0].name,
	});

	const resetForm = () => {
		setData({
			name: "",
			color: "gray",
			scope: scopes[0].name,
		});
	};

	const handleCreate = async () => {
		if (!data.name) {
			toast.error("Todos los campos son obligatorios");
			return;
		}
		await createTag(data).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	return (
		<Card className="px-4 py-0 overflow-auto">
			<div className="flex space-x-2 items-center justify-between border-b pb-2 sticky top-0 bg-white pt-4">
				<Title>Etiquetas</Title>
				{validateRoles(profile.roles, ["admin"], []) && (
					<Button
						variant="primary"
						color="sky"
						onClick={() => setOpenCreate(true)}
					>
						Crear Etiqueta
					</Button>
				)}
			</div>
			<Table className="w-full">
				{profile.company.tags
					.slice()
					.sort((a, b) => a.scope.localeCompare(b.scope))
					.map((tag) => (
						<TagItem key={tag.id} tag={tag} />
					))}
			</Table>
			<Modal
				open={openCreate}
				setOpen={setOpenCreate}
				title="Crear Etiqueta"
				action={handleCreate}
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
			</Modal>
		</Card>
	);
}
