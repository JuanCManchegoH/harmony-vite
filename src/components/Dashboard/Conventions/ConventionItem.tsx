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
import CenteredModal from "../../../common/CenteredModal";
import Toggle from "../../../common/Toggle";
import { useAppSelector } from "../../../hooks/store";
import {
	useConventions,
	useHandleConventions,
} from "../../../hooks/useConventions";
import { Convention } from "../../../services/company/types";
import classNames from "../../../utils/classNames";
import { conventionsColors } from "../../../utils/colors";
import { validateRoles } from "../../../utils/roles";

export default function ConventionItem({
	convention,
}: { convention: Convention }) {
	const { profile } = useAppSelector((state) => state.auth);
	const { deleteConvention, updateConvention } = useConventions();
	const { data, setData, handleUpdateConvention } =
		useHandleConventions(convention);
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
			<CenteredModal
				open={update}
				setOpen={setUpdate}
				title="Editar Convención"
				btnText="Editar"
				action={() => handleUpdateConvention(updateConvention, convention.id)}
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
							label="Avtivar Sugerencia"
							description="Al desactivar el personal marcado con la comvencion no sera sugerido"
						/>
					</div>
				</form>
			</CenteredModal>
		</TableRow>
	);
}
