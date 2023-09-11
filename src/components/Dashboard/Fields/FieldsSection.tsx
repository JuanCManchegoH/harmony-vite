import { DocumentTextIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import { Button, List, ListItem, Text } from "@tremor/react";
import { useState } from "react";
import CenteredModal from "../../../common/CenteredModal";
import EmptyState from "../../../common/EmptyState";
import { useAppSelector } from "../../../hooks/store";
import { useFields, useHandleField } from "../../../hooks/useFields";
import { validateRoles } from "../../../utils/roles";
import FieldItem from "./FieldItem";
import HandleField from "./HandleField";

export default function FieldsSection({
	type,
}: { type: "customers" | "workers" }) {
	const { roles } = useAppSelector((state) => state.auth.profile);
	const { customerFields, workerFields } = useAppSelector(
		(state) => state.auth.profile.company,
	);
	const { createField } = useFields();
	const { data, setData, handleCreateField } = useHandleField();
	const [openCreate, setOpenCreate] = useState(false);
	const title =
		type === "customers"
			? "Crear campo de clientes"
			: "Crear campo de personal";

	const selectedItems = type === "customers" ? customerFields : workerFields;

	return (
		<>
			{selectedItems.length <= 0 && (
				<EmptyState>
					<ListBulletIcon className="w-8 h-8 text-sky-500" />
					<Text className="text-gray-600">
						Aquí aparecerán los campos agregados
					</Text>
					<Text className="text-gray-400">
						Para agregar un campo, haz click en el botón "Agregar"
					</Text>
				</EmptyState>
			)}
			<ul className="divide-y divide-gray-200">
				{selectedItems.map((field, i) => (
					<FieldItem key={`${field.name}-${i}`} field={field} type={type} />
				))}
			</ul>
			<List className="border-t mb-2">
				{validateRoles(roles, ["admin"], []) && (
					<ListItem className="justify-center">
						<Button color="sky" size="xs" onClick={() => setOpenCreate(true)}>
							Agregar nuevo campo
						</Button>
					</ListItem>
				)}
			</List>
			<CenteredModal
				open={openCreate}
				setOpen={setOpenCreate}
				icon={DocumentTextIcon}
				title={title}
				action={() => handleCreateField(createField, type)}
				btnText="Crear"
			>
				<HandleField data={data} setData={setData} />
			</CenteredModal>
		</>
	);
}
