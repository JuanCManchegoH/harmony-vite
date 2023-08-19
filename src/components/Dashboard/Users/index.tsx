import {
	Button,
	Card,
	List,
	MultiSelect,
	MultiSelectItem,
	TextInput,
	Title,
} from "@tremor/react";
import { useState } from "react";
import { useAppSelector } from "../../../hooks/store";
import { useUsers } from "../../../hooks/useUsers";
import { roles, validateRoles } from "../../../utils/roles";
import Modal from "../../Modal";
import User from "./User";

interface CreateUserData {
	userName: string;
	email: string;
	company: string;
	password: string;
}

export default function Users() {
	const profile = useAppSelector((state) => state.auth.profile);
	const { users } = useAppSelector((state) => state.users);
	const { getNewUserRoles, createUser } = useUsers(profile, users);
	const [openCreate, setOpenCreate] = useState(false);
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
	const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
	const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
	const [data, setData] = useState<CreateUserData>({
		userName: "",
		email: "@",
		company: "",
		password: "",
	});
	const [repeatPassword, setRepeatPassword] = useState("");

	const resetForm = () => {
		setData({
			userName: "",
			email: "@",
			company: "",
			password: "",
		});
		setRepeatPassword("");
		setSelectedRoles([]);
		setSelectedCustomers([]);
		setSelectedWorkers([]);
	};

	const handleCreateUser = () => {
		const newUserRoles = getNewUserRoles(selectedRoles);
		createUser(
			{
				...data,
				roles: newUserRoles,
				customers: selectedCustomers.length === 0 ? ["all"] : selectedCustomers,
				workers: selectedWorkers.length === 0 ? ["all"] : selectedWorkers,
			},
			repeatPassword,
		).then((res) => {
			if (res) {
				resetForm();
			}
		});
	};

	return (
		<Card className="row-span-2 col-span-2 p-4 overflow-auto">
			<div className="flex space-x-2 items-center justify-between border-b pb-2">
				<Title>Usuarios</Title>
				{validateRoles(profile.roles, ["admin"], []) && (
					<Button
						variant="primary"
						onClick={() => setOpenCreate(true)}
						color="sky"
					>
						Crear Usuario
					</Button>
				)}
			</div>
			<List>
				{users.map((user) => (
					<User key={user.id} user={user} />
				))}
			</List>
			<Modal
				open={openCreate}
				setOpen={setOpenCreate}
				title="Crear usuario"
				btnText="Crear"
				action={() => handleCreateUser()}
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
					<TextInput
						type="password"
						placeholder="Contraseña*"
						value={data.password}
						onChange={(e) => setData({ ...data, password: e.target.value })}
					/>
					<TextInput
						type="password"
						autoComplete="off"
						placeholder="Repetir contraseña*"
						value={repeatPassword}
						onChange={(e) => setRepeatPassword(e.target.value)}
					/>
					{data.password === repeatPassword && repeatPassword.length > 8 && (
						<span className="col-span-2 text-green-500 text-sm text-end">
							Las contraseñas coinciden
						</span>
					)}
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
		</Card>
	);
}
