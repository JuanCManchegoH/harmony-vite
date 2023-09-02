import { ListBulletIcon, QueueListIcon } from "@heroicons/react/24/solid";
import {
	Button,
	Select,
	SelectItem,
	Table,
	TableBody,
	Text,
	TextInput,
	Title,
} from "@tremor/react";
import { useState } from "react";
import CenteredModal from "../../../common/CenteredModal";
import EmptyState from "../../../common/EmptyState";
import Toggle from "../../../common/Toggle";
import { useAppSelector } from "../../../hooks/store";
import {
	useConventions,
	useHandleConventions,
} from "../../../hooks/useConventions";
import { conventionsColors } from "../../../utils/colors";
import { validateRoles } from "../../../utils/roles";
import ConventionItem from "./ConventionItem";

export default function Conventions() {
	const { roles } = useAppSelector((state) => state.auth.profile);
	const { conventions } = useAppSelector((state) => state.auth.profile.company);
	const { createConvention } = useConventions();
	const { data, setData, handleCreateConvention } = useHandleConventions();
	const [openCreate, setOpenCreate] = useState(false);

	return (
		<>
			<div className="flex space-x-2 items-center justify-between border-b pb-2 mb-2">
				<Title>Convenciones</Title>
				{validateRoles(roles, ["admin"], []) && (
					<Button
						variant="primary"
						color="sky"
						onClick={() => setOpenCreate(true)}
						size="xs"
					>
						Crear Convención
					</Button>
				)}
			</div>
			{conventions.length <= 0 && (
				<EmptyState>
					<ListBulletIcon className="w-8 h-8 text-sky-500" />
					<Text className="text-gray-600">
						Aquí aparecerán las convenciones agregadas
					</Text>
					<Text className="text-gray-400">
						Para agregar un campo, haz click en el botón "Agregar"
					</Text>
				</EmptyState>
			)}
			<Table>
				<TableBody>
					{conventions
						.slice()
						.sort((a, b) => a.color.localeCompare(b.color))
						.map((convention) => (
							<ConventionItem key={convention.id} convention={convention} />
						))}
				</TableBody>
			</Table>
			<CenteredModal
				open={openCreate}
				setOpen={setOpenCreate}
				icon={QueueListIcon}
				title="Crear Convención"
				btnText="Crear"
				action={() => handleCreateConvention(createConvention)}
			>
				<form className="grid grid-cols-2 gap-2">
					<TextInput
						className="col-span-2"
						placeholder="Nombre"
						maxLength={15}
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
						onValueChange={(value) => setData({ ...data, color: value })}
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
							label="Avtivar Sugerencia"
							description="Al desactivar el personal marcado con la comvencion no sera sugerido"
						/>
					</div>
				</form>
			</CenteredModal>
		</>
	);
}
