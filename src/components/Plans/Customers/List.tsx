import { StarIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
	Card,
	Subtitle,
	Table,
	TableCell,
	TableRow,
	Text,
} from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import { CustomerData } from ".";
import EmptyState from "../../../common/EmptyState";
import { useAppSelector } from "../../../hooks/store";
import { useCustomers } from "../../../hooks/useCustomers";
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
	const { deleteCustomer } = useCustomers();

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
		<Card className="p-2">
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
			<Table>
				{displayCustomers.map((customer) => (
					<TableRow key={customer.id} className="border-b">
						{openDelete && (
							<TableCell className="p-2">
								<XMarkIcon
									className="w-5 h-5 cursor-pointer hover:text-red-500"
									onClick={() => deleteCustomer(customer.id, customers)}
								/>
							</TableCell>
						)}
						<TableCell
							className="p-2 cursor-pointer group"
							onClick={() => {
								handleSelect(customer);
								setSelectedCustomer(customer);
							}}
						>
							<Text className="group-hover:text-sky-500">{customer.name}</Text>
							<Subtitle className="group-hover:text-sky-900">
								{customer.identification}
							</Subtitle>
						</TableCell>
						<TableCell className="p-2">{customer.city}</TableCell>
						<TableCell className="p-2">
							<StarIcon
								className={classNames(
									"w-5 h-5 cursor-pointer",
									selected === customer.id
										? "text-yellow-400"
										: "text-gray-500",
								)}
								onClick={() => setSelected(customer.id)}
							/>
						</TableCell>
					</TableRow>
				))}
			</Table>
		</Card>
	);
}
