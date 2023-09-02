import { ListBulletIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
	Badge,
	Button,
	NumberInput,
	Select,
	SelectItem,
	Text,
	TextInput,
} from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import EmptyState from "../../../common/EmptyState";
import Toggle from "../../../common/Toggle";
import { CreateData } from "../../../hooks/useFields";

export default function HandleField({
	data,
	setData,
}: { data: CreateData; setData: Dispatch<SetStateAction<CreateData>> }) {
	return (
		<form className="grid grid-cols-2 gap-2">
			<TextInput
				className="col-span-2"
				type="text"
				placeholder="Nombre del campo*"
				value={data.name}
				onChange={(e) => setData({ ...data, name: e.target.value })}
			/>
			<NumberInput
				placeholder="Tamaño del campo*"
				title="Tamaño del campo*"
				value={data.size}
				min={1}
				max={2}
				onValueChange={(v) => setData({ ...data, size: v })}
				onKeyDown={(e) => e.preventDefault()}
				onKeyUp={(e) => e.preventDefault()}
			/>
			<Select
				placeholder="Tipo de campo*"
				value={data.type}
				onValueChange={(v) => setData({ ...data, type: v })}
			>
				<SelectItem value="text">Texto</SelectItem>
				<SelectItem value="number">Número</SelectItem>
				<SelectItem value="date">Fecha</SelectItem>
				<SelectItem value="select">Selección</SelectItem>
			</Select>
			{data.type === "select" && (
				<div className="col-span-2 flex gap-2">
					<TextInput
						type="text"
						placeholder="Opción*"
						value={data.option}
						onChange={(e) => setData({ ...data, option: e.target.value })}
					/>
					<Button
						color="sky"
						size="xs"
						onClick={(e) => {
							e.preventDefault();
							data.option &&
								setData((prev) => {
									return {
										...prev,
										options: [...data.options, data.option],
										option: "",
									};
								});
						}}
					>
						Agregar
					</Button>
				</div>
			)}
			<div className="col-span-2">
				<h1 className="text-sm font-bold">Opciones</h1>
				<div className="flex flex-wrap gap-2 mt-2">
					{data.options.length <= 0 && (
						<EmptyState>
							<ListBulletIcon className="w-8 h-8 text-sky-500" />
							<Text className="text-gray-600">
								Aquí aparecerán las opciones agregadas
							</Text>
							<Text className="text-gray-400">
								Para agregar una opción, haz click en el botón "Agregar"
							</Text>
						</EmptyState>
					)}
					{data.options.map((option, i) => (
						<Badge key={`${option}-${i}`} color="sky">
							<span className="flex items-center gap-1">
								{option}
								<XMarkIcon
									className="w-4 h-4 cursor-pointer"
									onClick={() =>
										setData({
											...data,
											options: data.options.filter((o) => o !== option),
										})
									}
								/>
							</span>
						</Badge>
					))}
				</div>
			</div>
			<div className="col-span-2 text-left">
				<Toggle
					enabled={data.required}
					setEnabled={() => setData({ ...data, required: !data.required })}
					label="Campo obligatorio"
					description="El campo será obligatorio al crear o modificar un registro"
				/>
			</div>
		</form>
	);
}
