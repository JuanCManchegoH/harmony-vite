import { NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { Field } from "../services/customers/types";

export default function HandleFields({
	fields,
	setFileds,
}: {
	fields: Field[];
	setFileds: Dispatch<SetStateAction<Field[]>>;
}) {
	return (
		<>
			{fields.map((field, index) => (
				<>
					{field.type === "text" && (
						<TextInput
							key={field.id}
							placeholder={`${field.name}${field.required && "*"}`}
							value={field.value}
							onChange={(e) => {
								const newFields = [...fields];
								newFields[index].value = e.target.value;
								setFileds(newFields);
							}}
						/>
					)}
					{field.type === "number" && (
						<NumberInput
							key={field.id}
							placeholder={`${field.name}${field.required && "*"}`}
							value={field.value}
							onChange={(e) => {
								const newFields = [...fields];
								newFields[index].value = e.target.value;
								setFileds(newFields);
							}}
						/>
					)}
					{field.type === "select" && (
						<Select
							key={field.id}
							placeholder={`${field.name}${field.required && "*"}`}
							value={field.value}
							onValueChange={(value) => {
								const newFields = [...fields];
								newFields[index].value = value;
								setFileds(newFields);
							}}
						>
							{field.options?.map((option) => (
								<SelectItem value={option}>{option}</SelectItem>
							))}
						</Select>
					)}
					{field.type === "date" && (
						<div className="relative">
							<label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-500">
								{`${field.name}${field.required && "*"}`}
							</label>
							<input
								className="w-full rounded-md py-2 text-gray-600 text-sm border-gray-200 shadow-sm pl-4 pr-2 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent cursor-text"
								type="date"
								key={field.id}
								value={field.value}
								onChange={(e) => {
									const newFields = [...fields];
									newFields[index].value = e.target.value;
									setFileds(newFields);
								}}
							/>
						</div>
					)}
				</>
			))}
		</>
	);
}
