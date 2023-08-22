import {
	ArrowSmallRightIcon,
	MagnifyingGlassIcon,
	TrashIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Button, Card, Text, TextInput } from "@tremor/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "../../../hooks/store";
import { useCustomers } from "../../../hooks/useCustomers";
import { CustomerWithId, Field } from "../../../services/customers/types";
import classNames from "../../../utils/classNames";
import { validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";
import Customer from "./Customer";
import List from "./List";

export interface CustomerData {
	name: string;
	identification: string;
	city: string;
	contact: string;
	phone: string;
	address: string;
	tags: string[];
	branches: string[];
	active: boolean;
}

export default function Customers({
	open,
	setOpen,
	selected,
	setSelected,
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	selected: string;
	setSelected: Dispatch<SetStateAction<string>>;
}) {
	const profile = useAppSelector((state) => state.auth.profile);
	const { createCustomer, updateCustomer } = useCustomers();
	const customers = useAppSelector((state) => state.customers.customers);
	const [openCustomer, setOpenCustomer] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [fields, setFields] = useState<Field[]>([]);
	const [search, setSearch] = useState("");
	useEffect(() => {
		setFields(
			profile.company.customerFields.map((field) => ({
				id: field.id,
				name: field.name,
				size: field.size,
				type: field.type,
				options: field.options,
				required: field.required,
				value: field.type === "date" ? new Date().toISOString() : "",
			})),
		);
	}, [profile]);

	const [selectedCustomer, setSelectedCustomer] =
		useState<CustomerWithId | null>(null);
	const [branch, setBranch] = useState<string>("");
	const [data, setData] = useState<CustomerData>({
		name: "",
		identification: "",
		city: "",
		contact: "",
		phone: "",
		address: "",
		tags: [] as string[],
		branches: [] as string[],
		active: true,
	});

	const resetForm = () => {
		setData({
			name: "",
			identification: "",
			city: "",
			contact: "",
			phone: "",
			address: "",
			tags: [] as string[],
			branches: [] as string[],
			active: true,
		});
		setFields(
			profile.company.customerFields.map((field) => ({
				id: field.id,
				name: field.name,
				size: field.size,
				type: field.type,
				options: field.options,
				required: field.required,
				value: field.type === "date" ? new Date().toISOString() : "",
			})),
		);
	};

	const handleCreate = async () => {
		if (
			!data.name ||
			!data.identification ||
			!data.city ||
			!data.contact ||
			!data.phone ||
			!data.address
		) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		if (fields.some((field) => field.required && !field.value)) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		const tags = data.tags.length === 0 ? ["all"] : data.tags;
		const customer = {
			...data,
			tags,
			fields,
		};
		await createCustomer(customer, customers).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	const handleUpdate = async (id: string) => {
		if (
			!data.name ||
			!data.identification ||
			!data.city ||
			!data.contact ||
			!data.phone ||
			!data.address
		) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		if (fields.some((field) => field.required && !field.value)) {
			toast.error("Todos los campos con * son obligatorios");
			return;
		}
		const tags = data.tags.length === 0 ? ["all"] : data.tags;
		const customer = {
			...data,
			tags,
			fields,
		};
		await updateCustomer(customer, id, customers);
	};

	const action = () => {
		if (selectedCustomer) {
			return handleUpdate(selectedCustomer.id);
		}
		if (openCustomer) {
			return handleCreate();
		}
	};

	return (
		<Modal
			open={open}
			setOpen={setOpen}
			title="Clientes"
			btnText={selectedCustomer ? "Actualizar" : "Crear"}
			action={selectedCustomer || openCustomer ? action : undefined}
		>
			<section className="flex flex-col gap-2">
				<header className="flex gap-2">
					<nav aria-label="Breadcrumb" className="w-full">
						<ol className="flex space-x-2 rounded-md bg-white shadow p-2">
							<li>
								<button
									type="button"
									className={classNames(
										"hover:text-gray-600 cursor-pointer flex items-center",
										!selectedCustomer ? "text-gray-600" : "text-gray-500",
									)}
									onClick={() => {
										setSelectedCustomer(null);
										setOpenCustomer(false);
									}}
								>
									<UserGroupIcon className="h-5 w-5" />
									<Text className="hover:text-gray-600 ml-2">Clientes</Text>
								</button>
							</li>
							{selectedCustomer && (
								<li className="flex items-center">
									<ArrowSmallRightIcon
										className="h-4 w-4 text-gray-600"
										aria-hidden="true"
									/>
									<Text className="hover:text-gray-600 ml-2">
										{selectedCustomer.name}
									</Text>
								</li>
							)}
							{openCustomer && (
								<li className="flex items-center">
									<ArrowSmallRightIcon
										className="h-4 w-4 text-gray-600"
										aria-hidden="true"
									/>
									<Text className="hover:text-gray-600 ml-2">
										Crear Cliente
									</Text>
								</li>
							)}
						</ol>
					</nav>
					<Button
						color="sky"
						size="xs"
						onClick={() => {
							resetForm();
							!selectedCustomer && setOpenCustomer(!openCustomer);
							selectedCustomer && setSelectedCustomer(null);
						}}
						variant={openCustomer || selectedCustomer ? "secondary" : "primary"}
					>
						{openCustomer || selectedCustomer ? "Volver" : "Crear Cliente"}
					</Button>
				</header>
				{!openCustomer && !selectedCustomer && (
					<div className="flex items-center">
						<TextInput
							color="sky"
							placeholder="Nombre del cliente"
							icon={MagnifyingGlassIcon}
							disabled={customers.length === 0}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						{validateRoles(profile.roles, ["handle_customers"], []) && (
							<Card className="flex ml-2 p-2 w-10 justify-center group cursor-pointer hover:bg-red-500">
								<TrashIcon
									className={classNames(
										"h-5 w-5 group-hover:text-white",
										openDelete ? "text-rose-500" : "text-gray-500",
									)}
									onClick={() => setOpenDelete(!openDelete)}
								/>
							</Card>
						)}
					</div>
				)}
				{openCustomer || selectedCustomer ? (
					<Customer
						data={data}
						setData={setData}
						fields={fields}
						setFields={setFields}
						branch={branch}
						setBranch={setBranch}
					/>
				) : null}
				{!openCustomer && !selectedCustomer && (
					<List
						search={search}
						openDelete={openDelete}
						selected={selected}
						setSelected={setSelected}
						setSelectedCustomer={setSelectedCustomer}
						setData={setData}
						setFields={setFields}
					/>
				)}
			</section>
		</Modal>
	);
}
