import { MultiSelect, Select, SelectItem, TextInput } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { WorkerData } from ".";
import HandleFields from "../../../common/HandleFields";
import { useAppSelector } from "../../../hooks/store";
import { Field } from "../../../services/customers/types";
import cities from "../../../utils/cities";

export default function Worker({
	data,
	setData,
	fields,
	setFields,
}: {
	data: WorkerData;
	setData: Dispatch<SetStateAction<WorkerData>>;
	fields: Field[];
	setFields: Dispatch<SetStateAction<Field[]>>;
}) {
	const profile = useAppSelector((state) => state.auth.profile);
	return (
		<form className="grid grid-cols-2 gap-2">
			<TextInput
				className="col-span-2"
				color="sky"
				placeholder="Nombre de la persona*"
				value={data.name}
				onChange={(e) => setData({ ...data, name: e.target.value })}
			/>
			<TextInput
				color="sky"
				placeholder="Identificación*"
				value={data.identification}
				onChange={(e) => setData({ ...data, identification: e.target.value })}
			/>
			<Select
				color="sky"
				placeholder="Ciudad*"
				value={data.city}
				onValueChange={(value) => setData({ ...data, city: value })}
			>
				{cities.map((city) => (
					<SelectItem value={city.name}>{city.name}</SelectItem>
				))}
			</Select>
			<TextInput
				color="sky"
				placeholder="Teléfono"
				value={data.phone}
				onChange={(e) => setData({ ...data, phone: e.target.value })}
			/>
			<TextInput
				color="sky"
				placeholder="Dirección"
				value={data.address}
				onChange={(e) => setData({ ...data, address: e.target.value })}
			/>
			<MultiSelect
				color="sky"
				placeholder="Etiquetas*"
				value={data.tags}
				onValueChange={(value) => setData({ ...data, tags: value })}
			>
				<>
					<SelectItem value="all">TODOS</SelectItem>
					{profile.company.tags
						.filter((tag) => tag.scope === "workers")
						.map((tag) => (
							<SelectItem value={tag.name} className="uppercase">
								{tag.name}
							</SelectItem>
						))}
				</>
			</MultiSelect>
			<HandleFields fields={fields} setFileds={setFields} />
		</form>
	);
}
