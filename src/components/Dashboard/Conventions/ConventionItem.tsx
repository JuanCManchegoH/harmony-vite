import { XMarkIcon } from "@heroicons/react/24/solid";
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
import { useAppSelector } from "../../../hooks/store";
import { useConventions } from "../../../hooks/useConventions";
import { Convention } from "../../../services/company/types";
import classNames from "../../../utils/classNames";
import { conventionsColors } from "../../../utils/colors";
import { validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";

export default function ConventionItem({
	convention,
}: { convention: Convention }) {
	const { profile } = useAppSelector((state) => state.auth);
	const { deleteConvention, updateConvention } = useConventions();
	const [update, setUpdate] = useState(false);
	const [data, setData] = useState({
		name: convention.name,
		abbreviation: convention.abbreviation,
		color: convention.color,
	});

	const handleUpdateConvention = () => {
		if (!data.name || !data.abbreviation || !data.color) {
			toast.error("Todos los campos son obligatorios");
			return;
		}
		if (data.abbreviation.length > 2) {
			toast.error("La abreviatura debe tener máximo 2 caracteres");
			return;
		}
		updateConvention(data, convention.id).then((res) => {
			if (res) {
				setUpdate(false);
			}
		});
	};

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
									onClick: () => deleteConvention(convention.id),
								},
							})
						}
					/>
				</TableCell>
			)}
			<TableCell className="py-2">{convention.name}</TableCell>
			<TableCell
				className={classNames(
					`text-${convention.color}-400`,
					"font-semibold hidden py-2 lg:table-cell",
				)}
			>
				{
					conventionsColors.find((c) => c.value === convention.color)
						?.abbreviation
				}
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
			<Modal
				open={update}
				setOpen={setUpdate}
				title="Editar Convención"
				btnText="Editar"
				action={handleUpdateConvention}
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
				</form>
			</Modal>
		</TableRow>
	);
}
