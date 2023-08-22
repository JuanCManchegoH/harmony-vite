import {
	Button,
	Card,
	MultiSelect,
	MultiSelectItem,
	Table,
	TextInput,
	Title,
} from "@tremor/react";
import { useState } from "react";
import { useAppSelector } from "../../../hooks/store";
import { useUsers } from "../../../hooks/useUsers";
import { getRolName, roles, validateRoles } from "../../../utils/roles";
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

	const customerTags = profile.company.tags.filter(
		(tag) => tag.scope === "customers",
	);
	const workerTags = profile.company.tags.filter(
		(tag) => tag.scope === "workers",
	);
	const showRoles =
		getRolName(profile.roles) === "SuperAdmin"
			? roles
			: roles.filter((role) => role.name !== "SuperAdmin");

	return (
		<Card className="px-4 py-0 overflow-auto lg:col-span-2 lg:row-span-2 ">
			<div className="flex space-x-2 items-center justify-between border-b pb-2 sticky top-0 bg-white pt-4">
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
			<Table>
				{users.map((user) => {
					const superAdmin =
						getRolName(user.roles) === "SuperAdmin" ? true : false;
					return (
						<>
							{superAdmin && getRolName(profile.roles) === "SuperAdmin" && (
								<User key={user.id} user={user} />
							)}
							{!superAdmin && <User key={user.id} user={user} />}
						</>
					);
				})}
			</Table>
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
						{showRoles.map((role) => (
							<MultiSelectItem key={role.name} value={role.name}>
								{role.name}
							</MultiSelectItem>
						))}
					</MultiSelect>
					<MultiSelect
						placeholder="Clientes"
						value={selectedCustomers}
						onValueChange={(value) => setSelectedCustomers(value)}
					>
						<>
							<MultiSelectItem value="all">TODOS</MultiSelectItem>
							{customerTags.map((tag) => (
								<MultiSelectItem key={tag.id} value={tag.name}>
									{tag.name}
								</MultiSelectItem>
							))}
						</>
					</MultiSelect>
					<MultiSelect
						placeholder="Personal"
						value={selectedWorkers}
						onValueChange={(value) => setSelectedWorkers(value)}
					>
						<>
							<MultiSelectItem value="all">TODOS</MultiSelectItem>
							{workerTags.map((tag) => (
								<MultiSelectItem key={tag.id} value={tag.name}>
									{tag.name}
								</MultiSelectItem>
							))}
						</>
					</MultiSelect>
				</form>
			</Modal>
		</Card>
	);
}
