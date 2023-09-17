import {
	ArrowSmallRightIcon,
	MagnifyingGlassIcon,
	TrashIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Button, Card, Text, TextInput } from "@tremor/react";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../../../common/RightModal";
import { useAppSelector } from "../../../hooks/store";
import { useCustomers, useHandleCustomer } from "../../../hooks/useCustomers";
import { CustomerWithId } from "../../../services/customers/types";
import classNames from "../../../utils/classNames";
import { validateRoles } from "../../../utils/roles";
import Customer from "./Customer";
import List from "./List";

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
	const customers = useAppSelector((state) => state.customers.customers);
	const { createCustomer, updateCustomer } = useCustomers(customers);
	const {
		data,
		setData,
		fields,
		setFields,
		branch,
		setBranch,
		resetForm,
		handleCreate,
		handleUpdate,
	} = useHandleCustomer(profile.company.customerFields);
	const [selectedCustomer, setSelectedCustomer] =
		useState<CustomerWithId | null>(null);
	const [openCustomer, setOpenCustomer] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [search, setSearch] = useState("");

	const action = () => {
		if (selectedCustomer) {
			return handleUpdate(updateCustomer, selectedCustomer.id);
		}
		if (openCustomer) {
			return handleCreate(createCustomer);
		}
	};

	return (
		<Modal
			open={open}
			setOpen={setOpen}
			icon={UserGroupIcon}
			title="Clientes"
			btnText={selectedCustomer ? "Actualizar" : "Crear"}
			action={
				validateRoles(profile.roles, ["handle_customers"], []) &&
				(selectedCustomer || openCustomer)
					? action
					: undefined
			}
		>
			<section className="flex flex-col gap-2">
				<header className="flex gap-2">
					<nav aria-label="Breadcrumb" className="w-full">
						<ol className="flex space-x-2 rounded-md bg-gray-50 shadow p-2">
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
					{validateRoles(profile.roles, ["handle_customers"], []) && (
						<Button
							color="sky"
							size="xs"
							onClick={() => {
								resetForm();
								!selectedCustomer && setOpenCustomer(!openCustomer);
								selectedCustomer && setSelectedCustomer(null);
							}}
							variant={
								openCustomer || selectedCustomer ? "secondary" : "primary"
							}
						>
							{openCustomer || selectedCustomer ? "Volver" : "Crear Cliente"}
						</Button>
					)}
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
