import { useAppSelector } from "../../../hooks/store";
import { useConventions } from "../../../hooks/useConventions";
import { conventionsColors } from "../../../utils/colors";
import { validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";
import ConventionItem from "./ConventionItem";

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

export default function Conventions() {
	const profile = useAppSelector((state) => state.auth.profile);
	const { createConvention } = useConventions();
	const [openCreate, setOpenCreate] = useState(false);
	const [data, setData] = useState({
		name: "",
		abbreviation: "",
		color: "",
	});

	const resetForm = () => {
		setData({
			name: "",
			abbreviation: "",
			color: "",
		});
	};

	const handleCreate = async () => {
		if (!data.name || !data.abbreviation || !data.color) {
			toast.error("Todos los campos son obligatorios");
			return;
		}
		if (data.abbreviation.length > 2) {
			toast.error("La abreviatura debe tener máximo 2 caracteres");
			return;
		}
		await createConvention(data).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	return (
		<Card className="px-4 py-0 overflow-auto">
			<div className="flex space-x-2 items-center justify-between border-b pb-2 sticky top-0 bg-white pt-4">
				<Title>Convenciones</Title>
				{validateRoles(profile.roles, ["admin"], []) && (
					<Button
						variant="primary"
						color="sky"
						onClick={() => setOpenCreate(true)}
					>
						Crear Convención
					</Button>
				)}
			</div>
			<Table>
				{/* sort by color */}
				{profile.company.conventions
					.slice()
					.sort((a, b) => a.color.localeCompare(b.color))
					.map((convention) => (
						<ConventionItem key={convention.id} convention={convention} />
					))}
			</Table>
			<Modal
				open={openCreate}
				setOpen={setOpenCreate}
				title="Crear Convención"
				btnText="Crear"
				action={handleCreate}
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
		</Card>
	);
}
