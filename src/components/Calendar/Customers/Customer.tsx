import { XMarkIcon } from "@heroicons/react/24/outline";
import {
	Badge,
	Button,
	MultiSelect,
	Select,
	SelectItem,
	Text,
	TextInput,
} from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import HandleFields from "../../../common/HandleFields";
import { useAppSelector } from "../../../hooks/store";
import { CustomerData } from "../../../hooks/useCustomers";
import { Field } from "../../../services/customers/types";
import cities from "../../../utils/cities";

export default function Customer({
	data,
	setData,
	fields,
	setFields,
	branch,
	setBranch,
}: {
	data: CustomerData;
	setData: Dispatch<SetStateAction<CustomerData>>;
	fields: Field[];
	setFields: Dispatch<SetStateAction<Field[]>>;
	branch: string;
	setBranch: Dispatch<SetStateAction<string>>;
}) {
	const profile = useAppSelector((state) => state.auth.profile);
	return (
		<form className="grid grid-cols-2 gap-2">
			<TextInput
				className="col-span-2"
				color="sky"
				placeholder="Nombre del cliente*"
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
				placeholder="Contacto"
				value={data.contact}
				onChange={(e) => setData({ ...data, contact: e.target.value })}
			/>
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
						.filter((tag) => tag.scope === "customers")
						.map((tag) => (
							<SelectItem value={tag.name} className="uppercase">
								{tag.name}
							</SelectItem>
						))}
				</>
			</MultiSelect>
			<HandleFields fields={fields} setFileds={setFields} />
			<div className="col-span-2 flex gap-2">
				<TextInput
					color="sky"
					placeholder="Agregar sede"
					value={branch}
					onChange={(e) => setBranch(e.target.value)}
				/>
				<Button
					color="sky"
					onClick={(e) => {
						e.preventDefault();
						if (!branch || data.branches.includes(branch)) return;
						setData({ ...data, branches: [...data.branches, branch] });
						setBranch("");
					}}
				>
					Agregar
				</Button>
			</div>
			{data.branches.length > 0 && (
				<div className="col-span-2">
					<Text className="text-sm font-bold my-2">Sedes</Text>
					<div className="flex flex-wrap gap-2 mt-2">
						{data.branches.map((branch) => (
							<Badge color="sky">
								<span className="flex items-center gap-1">
									<span>{branch}</span>
									<XMarkIcon
										className="h-5 w-5 ml-2 cursor-pointer"
										onClick={() =>
											setData({
												...data,
												branches: data.branches.filter((b) => b !== branch),
											})
										}
									/>
								</span>
							</Badge>
						))}
					</div>
				</div>
			)}
		</form>
	);
}
