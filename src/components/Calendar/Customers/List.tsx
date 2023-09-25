import { StarIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Card, Subtitle, Text } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import EmptyState from "../../../common/EmptyState";
import { useAppSelector } from "../../../hooks/store";
import { CustomerData, useCustomers } from "../../../hooks/useCustomers";
import { CustomerWithId, Field } from "../../../services/customers/types";
import classNames from "../../../utils/classNames";

export default function List({
	search,
	openDelete,
	selected,
	setSelected,
	setSelectedCustomer,
	setData,
	setFields,
}: {
	search: string;
	openDelete: boolean;
	selected: string;
	setSelected: Dispatch<SetStateAction<string>>;
	setSelectedCustomer: Dispatch<SetStateAction<CustomerWithId | null>>;
	setData: Dispatch<SetStateAction<CustomerData>>;
	setFields: Dispatch<SetStateAction<Field[]>>;
}) {
	const fields = useAppSelector(
		(state) => state.auth.profile.company.customerFields,
	);
	const customers = useAppSelector((state) => state.customers.customers);
	const { deleteCustomer } = useCustomers(customers);

	const handleSelect = (customer: CustomerWithId) => {
		setData({
			name: customer.name,
			identification: customer.identification,
			city: customer.city,
			contact: customer.contact,
			phone: customer.phone,
			address: customer.address,
			tags: customer.tags,
			branches: customer.branches,
			active: customer.active,
		});
		setFields(
			fields.map((field) => {
				const validateValue = customer.fields.find(
					(f) => f.id === field.id,
				)?.value;
				const value = validateValue
					? validateValue
					: field.type === "date"
					? new Date().toISOString()
					: "";
				return {
					id: field.id,
					name: field.name,
					size: field.size,
					type: field.type,
					options: field.options,
					required: field.required,
					value,
				};
			}),
		);
	};
	const displayCustomers = customers.filter(
		(customer) =>
			customer.name.toLowerCase().includes(search.toLowerCase()) ||
			customer.identification.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<Card className="px-2 py-0">
			{displayCustomers.length <= 0 && (
				<EmptyState>
					<UserGroupIcon className="w-10 h-10 text-sky-500" />
					<Text className="text-gray-600">
						Aquí aparecerán los clientes que coincida con tu búsqueda
					</Text>
					<Text className="text-gray-400">
						Para ver todos los clientes, solo deja el campo de búsqueda vacío
					</Text>
				</EmptyState>
			)}
			<ul className="divide-y divide-gray-200 select-none">
				{displayCustomers.map((customer) => (
					<li key={customer.id} className="grid grid-cols-4">
						<button
							type="button"
							className="p-2 cursor-pointer group col-span-2 text-left"
							onClick={() => {
								handleSelect(customer);
								setSelectedCustomer(customer);
							}}
						>
							<Text className="group-hover:text-sky-500 truncate max-w-[220px]">
								{customer.name}
							</Text>
							<Subtitle className="group-hover:text-sky-900 text-sm">
								{customer.identification}
							</Subtitle>
						</button>
						<Subtitle className="p-2 flex justify-end items-center text-sm">
							{customer.city}
						</Subtitle>
						<div className="p-2 flex justify-end items-center">
							{openDelete && (
								<XMarkIcon
									className="w-5 h-5 cursor-pointer hover:text-red-500"
									onClick={() =>
										toast("Confirmar acción", {
											action: {
												label: "Eliminar",
												onClick: () => deleteCustomer(customer.id),
											},
										})
									}
								/>
							)}
							{!openDelete && (
								<StarIcon
									className={classNames(
										"w-5 h-5 cursor-pointer",
										selected === customer.id
											? "text-rose-400"
											: "text-gray-400",
									)}
									onClick={() => setSelected(customer.id)}
								/>
							)}
						</div>
					</li>
				))}
			</ul>
		</Card>
	);
}
