import { Select, SelectItem, TextInput } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "../../../hooks/store";
import { StallData } from "../../../hooks/useStalls";
// import { HandleStall as HandleStallType } from "../../../services/stalls/types";

export default function HandleStall({
	branches,
	data,
	setData,
	creation,
}: {
	branches: string[];
	data: StallData;
	setData: Dispatch<SetStateAction<StallData>>;
	creation?: boolean;
}) {
	const { tags } = useAppSelector((state) => state.auth.profile.company);
	const allTags = [
		"",
		...tags.filter((tag) => tag.scope === "stalls").map((tag) => tag.name),
	];
	const allBranches = ["", ...branches];
	const setCreation = creation ? creation : false;
	return (
		<form className="grid grid-cols-2 gap-2">
			<TextInput
				className="col-span-1"
				placeholder="Nombre"
				color="sky"
				maxLength={20}
				value={data.name}
				onChange={(e) => setData({ ...data, name: e.target.value })}
			/>
			<Select
				placeholder="Sin etiqueta"
				value={data.tag}
				onValueChange={(value) => setData({ ...data, tag: value })}
			>
				{allTags.map((tag) => (
					<SelectItem value={tag}>{tag}</SelectItem>
				))}
			</Select>
			<div className="col-span-2 relative">
				<label
					htmlFor="comment"
					className="absolute left-4 -top-1 text-xs font-medium leading-6 text-gray-500 bg-white px-1"
				>
					Descipción
				</label>
				<div className="mt-2">
					<textarea
						className="max-h-28 h-20 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
						value={data.description}
						onChange={(e) => setData({ ...data, description: e.target.value })}
					/>
				</div>
			</div>
			<Select
				placeholder="Ays"
				value={data.ays}
				onValueChange={(value) => setData({ ...data, ays: value })}
			>
				<SelectItem value="con-arma">Con Arma</SelectItem>
				<SelectItem value="sin-arma">Sin Arma</SelectItem>
				<SelectItem value="canino">Canino</SelectItem>
			</Select>
			{branches && branches.length > 0 && (
				<Select
					placeholder="Sin sede"
					value={data.branch}
					onValueChange={(value) => setData({ ...data, branch: value })}
				>
					{allBranches.map((branch) => (
						<SelectItem value={branch}>{branch}</SelectItem>
					))}
				</Select>
			)}
			{!setCreation && (
				<Select
					placeholder="Ays"
					value={data.stage.toString()}
					onValueChange={(value) =>
						setData({ ...data, stage: parseInt(value) })
					}
				>
					<SelectItem value="0">En curso</SelectItem>
					<SelectItem value="1">Bloqueado</SelectItem>
					<SelectItem value="2">Archivado</SelectItem>
				</Select>
			)}
		</form>
	);
}
