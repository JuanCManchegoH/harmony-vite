import {
	Badge,
	Button,
	MultiSelect,
	MultiSelectItem,
	TableCell,
	TableRow,
	TextInput,
} from "@tremor/react";
import { useState } from "react";
import { useAppSelector } from "../../../hooks/store";
import { useUsers } from "../../../hooks/useUsers";
import { UsersWithId } from "../../../services/users/types";
import { getRolName, roles, validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";

interface UpdateUserData {
	userName: string;
	email: string;
}

export default function User({ user }: { user: UsersWithId }) {
	const [opneUpdate, setOpenUpdate] = useState(false);
	const { users } = useAppSelector((state) => state.users);
	const { profile } = useAppSelector((state) => state.auth);
	const { getNewUserRoles, updateUser } = useUsers(profile, users);
	const [selectedRoles, setSelectedRoles] = useState<string[]>(
		roles
			.filter((role) => role.roles.every((r) => user.roles.includes(r)))
			.map((role) => role.name),
	);
	const [selectedCustomers, setSelectedCustomers] = useState<string[]>(
		user.customers,
	);
	const [selectedWorkers, setSelectedWorkers] = useState<string[]>(
		user.workers,
	);
	const [data, setData] = useState<UpdateUserData>({
		userName: user.userName,
		email: user.email,
	});
	const handleUpdateUser = () => {
		const newUserRoles = getNewUserRoles(selectedRoles);
		updateUser(
			{
				...data,
				roles: newUserRoles,
				customers: selectedCustomers,
				workers: selectedWorkers,
				active: true,
			},
			user.id,
		);
	};

	const superAdmin =
		getRolName(user.roles) === "SuperAdmin" ? ["SuperAdmin"] : [];

	return (
		<TableRow key={user.id} className="border-b">
			<TableCell className="pl-0 py-2">
				<div
					className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500"
					title={user.userName}
				>
					<span className="leading-none text-white font-pacifico">
						{user.userName[0]}
					</span>
				</div>
				<span className="ml-2">{user.userName}</span>
			</TableCell>
			<TableCell className="py-2">{user.email}</TableCell>
			<TableCell className="py-2">
				<Badge size="sm" color="sky">
					{getRolName(user.roles)}
				</Badge>
			</TableCell>
			{validateRoles(profile.roles, superAdmin, ["admin"]) && (
				<TableCell className="flex justify-end pr-0 py-2">
					<Button
						variant="secondary"
						color="sky"
						onClick={() => setOpenUpdate(true)}
					>
						Editar
					</Button>
				</TableCell>
			)}
			{superAdmin.length > 0 && getRolName(profile.roles) !== "SuperAdmin" && (
				<TableCell className="flex justify-end pr-0 py-2">
					<Button variant="secondary" color="gray" disabled>
						Editar
					</Button>
				</TableCell>
			)}
			<Modal
				open={opneUpdate}
				setOpen={setOpenUpdate}
				title={user.userName}
				action={() => handleUpdateUser()}
				btnText="Actualizar"
			>
				<form className="grid grid-cols-2 gap-2">
					<TextInput
						className="col-span-2"
						type="text"
						placeholder="Nombre de usuario*"
						value={data.userName}
						onChange={(e) => setData({ ...data, userName: e.target.value })}
					/>
					<TextInput
						className="col-span-2"
						type="email"
						placeholder="Correo electrónico*"
						value={data.email}
						onChange={(e) => setData({ ...data, email: e.target.value })}
					/>
					<MultiSelect
						placeholder="Roles*"
						value={selectedRoles}
						onValueChange={(v) => setSelectedRoles(v)}
					>
						{roles
							.filter((role) => role.name !== "SuperAdmin")
							.map((role) => (
								<MultiSelectItem key={role.name} value={role.name}>
									{role.name}
								</MultiSelectItem>
							))}
					</MultiSelect>
					<MultiSelect
						placeholder="Clientes"
						value={selectedCustomers}
						onValueChange={(v) => setSelectedCustomers(v)}
					>
						<MultiSelectItem value="all">Todos</MultiSelectItem>
					</MultiSelect>
					<MultiSelect
						placeholder="Personal"
						value={selectedWorkers}
						onValueChange={(v) => setSelectedWorkers(v)}
					>
						<MultiSelectItem value="all">Todos</MultiSelectItem>
					</MultiSelect>
				</form>
			</Modal>
		</TableRow>
	);
}
