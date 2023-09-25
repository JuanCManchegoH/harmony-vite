import {
	ArrowDownTrayIcon,
	ArrowUpTrayIcon,
	DocumentIcon,
} from "@heroicons/react/24/solid";
import { Badge, Icon, Text } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { FileState } from "../hooks/useCustomers";

export default function Uploader({
	selected,
	setSelected,
	downloadTemplate,
}: {
	selected: FileState;
	setSelected: Dispatch<SetStateAction<FileState>>;
	downloadTemplate: () => Promise<void>;
}) {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as ArrayBuffer;
				console.log(result);
				setSelected({
					name: file.name,
					type: file.type,
					size: file.size,
					arrayBuffer: result,
				});
			};
			reader.readAsArrayBuffer(file);
		}
	};
	return (
		<section className="grid grid-cols-2 gap-2 my-4">
			<div className="flex justify-between border rounded-md p-2">
				<Text className="flex text-left items-center">Descargar plantilla</Text>
				<label>
					<Icon
						className="cursor-pointer"
						icon={ArrowDownTrayIcon}
						variant="solid"
						color="gray"
						onClick={downloadTemplate}
					/>
				</label>
			</div>
			<div className="flex justify-between border rounded-md p-2">
				<Text className="flex text-left items-center">
					Seleccione el archivo a subir
				</Text>
				<label htmlFor="file">
					<Icon
						className="cursor-pointer"
						icon={ArrowUpTrayIcon}
						variant="solid"
						color="gray"
					/>
				</label>
				<input
					className="hidden"
					type="file"
					onChange={handleFileChange}
					id="file"
				/>
			</div>
			<div className="col-span-2 flex justify-end pt-2">
				<Badge className="cursor-pointer" icon={DocumentIcon} color="sky">
					{selected.name || "No se ha seleccionado un archivo"}
				</Badge>
			</div>
		</section>
	);
}
