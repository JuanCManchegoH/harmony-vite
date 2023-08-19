import { Switch } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
	Badge,
	Button,
	List,
	ListItem,
	NumberInput,
	Select,
	SelectItem,
	TabPanel,
	Table,
	TextInput,
} from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "../../../hooks/store";
import { useFields } from "../../../hooks/useFields";
import classNames from "../../../utils/classNames";
import { validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";
import FieldItem from "./FieldItem";

export default function FieldsSection({
	type,
}: { type: "customers" | "workers" }) {
	const { profile } = useAppSelector((state) => state.auth);
	const { createField } = useFields();
	const [openCreate, setOpenCreate] = useState(false);
	const [option, setOption] = useState<string>("");
	const [options, setOptions] = useState<string[]>([]);
	const title =
		type === "customers"
			? "Crear campo de clientes"
			: "Crear campo de personal";

	const [data, setData] = useState({
		name: "",
		size: 1,
		type: "",
		required: false,
		active: true,
	});

	const resetForm = () => {
		setData({
			name: "",
			size: 1,
			type: "",
			required: false,
			active: true,
		});
		setOptions([]);
		setOption("");
	};

	const handleCreateField = () => {
		if (!data.name || !data.size || !data.type) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		if (data.type === "select" && options.length === 0) {
			toast.error("Debe agregar al menos una opción");
			return;
		}
		createField(
			{
				...data,
				options,
			},
			type,
		).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	const selectedItems =
		type === "customers"
			? profile.company.customerFields
			: profile.company.workerFields;

	return (
		<TabPanel>
			<List className="border-y">
				{validateRoles(profile.roles, ["admin"], []) && (
					<ListItem>
						<span> Agregar un nuevo campo</span>
						<Button color="sky" size="xs" onClick={() => setOpenCreate(true)}>
							Agregar
						</Button>
					</ListItem>
				)}
			</List>
			<Table>
				{selectedItems.map((field, i) => (
					<FieldItem key={`${field.name}-${i}`} field={field} type={type} />
				))}
			</Table>
			<Modal
				open={openCreate}
				setOpen={setOpenCreate}
				title={title}
				action={handleCreateField}
				btnText="Crear"
			>
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
								value={option}
								onChange={(e) => setOption(e.target.value)}
							/>
							<Button
								color="sky"
								size="xs"
								onClick={(e) => {
									e.preventDefault();
									option && setOptions([...options, option]);
									setOption("");
								}}
							>
								Agregar
							</Button>
						</div>
					)}
					{options.length > 0 && (
						<div className="col-span-2">
							<h1 className="text-sm font-bold">Opciones</h1>
							<div className="flex flex-wrap gap-2 mt-2">
								{options.map((option, i) => (
									<Badge key={`${option}-${i}`} color="sky">
										<span className="flex items-center gap-1">
											{option}
											<XMarkIcon
												className="w-4 h-4 cursor-pointer"
												onClick={() =>
													setOptions(options.filter((o) => o !== option))
												}
											/>
										</span>
									</Badge>
								))}
							</div>
						</div>
					)}
					<Switch.Group
						as="div"
						className="flex items-center justify-between col-span-2"
					>
						<span className="flex flex-grow flex-col">
							<Switch.Label
								as="span"
								className="text-sm font-medium leading-6 text-gray-900"
								passive
							>
								Campo obligatorio
							</Switch.Label>
							<Switch.Description as="span" className="text-sm text-gray-500">
								El campo será obligatorio para los usuarios
							</Switch.Description>
						</span>
						<Switch
							checked={data.required}
							onChange={() => setData({ ...data, required: !data.required })}
							className={classNames(
								data.required ? "bg-sky-500" : "bg-gray-200",
								"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
							)}
						>
							<span className="sr-only">Use setting</span>
							<span
								className={classNames(
									data.required ? "translate-x-5" : "translate-x-0",
									"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
								)}
							>
								<span
									className={classNames(
										data.required
											? "opacity-0 duration-100 ease-out"
											: "opacity-100 duration-200 ease-in",
										"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
									)}
									aria-hidden="true"
								>
									<svg
										className="h-3 w-3 text-gray-400"
										fill="none"
										viewBox="0 0 12 12"
									>
										<title>Off</title>
										<path
											d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
								<span
									className={classNames(
										data.required
											? "opacity-100 duration-200 ease-in"
											: "opacity-0 duration-100 ease-out",
										"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
									)}
									aria-hidden="true"
								>
									<svg
										className="h-3 w-3 text-sky-500"
										fill="currentColor"
										viewBox="0 0 12 12"
									>
										<title>On</title>
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</Switch.Group>
				</form>
			</Modal>
		</TabPanel>
	);
}
