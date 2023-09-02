import { DocumentTextIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button, TableCell, TableRow } from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../../common/CenteredModal";
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
									onClick: () => deleteField(field.id, type),
								},
							})
						}
					/>
				</TableCell>
			)}
			<TableCell className="py-2">{field.name}</TableCell>
			<TableCell className="hidden py-2 2xl:table-cell">
				{types[field.type as keyof typeof types]}
			</TableCell>
			<TableCell className="hidden py-2 xl:table-cell">
				{field.required ? "Requerido" : "Opcional"}
			</TableCell>
			{validateRoles(profile.roles, ["admin"], []) && (
				<TableCell className="flex justify-end pr-0 py-2">
					<Button
						color="sky"
						size="xs"
						variant="secondary"
						onClick={() => setOpenUpdate(true)}
					>
						Editar
					</Button>
				</TableCell>
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
		</TableRow>
	);
}
