import { ListBulletIcon, RectangleGroupIcon } from "@heroicons/react/24/solid";
import {
	Button,
	NumberInput,
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
import { useAppSelector } from "../../../hooks/store";
import { useHandlePosition, usePositions } from "../../../hooks/usePositions";
import { validateRoles } from "../../../utils/roles";
import PositionItem from "./PositionItem";

export default function Positions() {
	const { roles } = useAppSelector((state) => state.auth.profile);
	const { positions } = useAppSelector((state) => state.auth.profile.company);
	const { createPosition } = usePositions();
	const { years, data, setData, handleCreatePosition } = useHandlePosition();
	const [openCreate, setOpenCreate] = useState(false);

	return (
		<>
			<div className="flex space-x-2 items-center justify-between border-b pb-2 mb-2">
				<Title>Cargos</Title>
				{validateRoles(roles, ["admin"], []) && (
					<Button
						variant="primary"
						onClick={() => setOpenCreate(true)}
						color="sky"
						size="xs"
					>
						Crear Cargo
					</Button>
				)}
			</div>
			{positions.length <= 0 && (
				<EmptyState>
					<ListBulletIcon className="w-8 h-8 text-sky-500" />
					<Text className="text-gray-600">
						Aquí aparecerán los cargos agregados
					</Text>
					<Text className="text-gray-400">
						Para agregar un campo, haz click en el botón "Agregar"
					</Text>
				</EmptyState>
			)}
			<Table>
				<TableBody>
					{positions.map((position) => (
						<PositionItem key={position.id} position={position} />
					))}
				</TableBody>
			</Table>
			<CenteredModal
				open={openCreate}
				setOpen={setOpenCreate}
				icon={RectangleGroupIcon}
				title="Crear Cargo"
				btnText="Crear"
				action={() => handleCreatePosition(createPosition)}
			>
				<form className="grid grid-cols-2 gap-2">
					<TextInput
						className="col-span-2"
						placeholder="Nombre del cargo*"
						value={data.name}
						onChange={(e) => setData({ ...data, name: e.target.value })}
					/>
					<NumberInput
						placeholder="Valor"
						min={0}
						value={data.value}
						onValueChange={(value) => setData({ ...data, value })}
					/>
					<Select
						placeholder="Año*"
						value={data.year}
						onValueChange={(value) => setData({ ...data, year: value })}
					>
						{years.map((year) => (
							<SelectItem key={year} value={year}>
								{year}
							</SelectItem>
						))}
					</Select>
					<Text className="col-span-2 text-justify">
						Tenga en cuenta que el valor del cargo se multiplicará por el número
						de horas de los turnos adicionales, si el valor es 0, no se sumará
						en el reporte de turnos adicionales.
					</Text>
				</form>
			</CenteredModal>
		</>
	);
}
