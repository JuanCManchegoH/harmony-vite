import { MultiSelect, MultiSelectItem } from "@tremor/react";
import { InsetLabel } from "../../../common/Inputs";
import { CreateData } from "../../../hooks/useUsers";
import { Profile } from "../../../services/auth/types";
import { UsersWithId } from "../../../services/users/types";
import { getRolName, roles } from "../../../utils/roles";

export default function HandleUser({
	user,
	data,
	setData,
	profile,
}: {
	user?: UsersWithId;
	data: CreateData;
	setData: React.Dispatch<React.SetStateAction<CreateData>>;
	profile: Profile;
}) {
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
		<form className="grid grid-cols-2 gap-2">
			<InsetLabel
				label="Nombre de usuario"
				type="text"
				autoComplete="username"
				placeholder="Nombre de usuario*"
				value={data.userName}
				onChange={(e) => setData({ ...data, userName: e.target.value })}
			/>
			<InsetLabel
				label="Correo"
				type="email"
				autoComplete="email"
				placeholder="Correo electrónico*"
				value={data.email}
				onChange={(e) => setData({ ...data, email: e.target.value })}
			/>
			{!user && (
				<>
					<InsetLabel
						label="Contraseña"
						type="password"
						autoComplete="new-password"
						placeholder="Contraseña*"
						value={data.password}
						onChange={(e) => setData({ ...data, password: e.target.value })}
					/>
					<InsetLabel
						label="Repetir contraseña"
						type="password"
						autoComplete="new-password"
						placeholder="Repetir contraseña*"
						value={data.repPassword}
						onChange={(e) => setData({ ...data, repPassword: e.target.value })}
					/>
				</>
			)}
			<MultiSelect
				placeholder="Roles*"
				value={data.selectedRoles}
				onValueChange={(value) => setData({ ...data, selectedRoles: value })}
			>
				{showRoles.map((role) => (
					<MultiSelectItem key={`dbd-users-r-${role.name}`} value={role.name}>
						{role.name}
					</MultiSelectItem>
				))}
			</MultiSelect>
			<MultiSelect
				placeholder="Clientes"
				value={data.selectedCustomers}
				onValueChange={(value) =>
					setData({ ...data, selectedCustomers: value })
				}
			>
				<>
					<MultiSelectItem value="all">TODOS</MultiSelectItem>
					{customerTags.map((tag) => (
						<MultiSelectItem key={`dbd-users-ct-${tag.id}`} value={tag.name}>
							{tag.name}
						</MultiSelectItem>
					))}
				</>
			</MultiSelect>
			<MultiSelect
				placeholder="Personal"
				value={data.selectedWorkers}
				onValueChange={(value) => setData({ ...data, selectedWorkers: value })}
			>
				<>
					<MultiSelectItem value="all">TODOS</MultiSelectItem>
					{workerTags.map((tag) => (
						<MultiSelectItem key={`dbd-users-wt-${tag.id}`} value={tag.name}>
							{tag.name}
						</MultiSelectItem>
					))}
				</>
			</MultiSelect>
			{data.password !== data.repPassword && (
				<span className="col-span-2 text-gray-500 text-sm text-end font-semibold">
					Las contraseñas deben tener al menos 8 caracteres y coincidir.
				</span>
			)}
			{data.password === data.repPassword && data.password.length > 8 && (
				<span className="col-span-2 text-green-400 text-sm text-end font-semibold">
					La contraseña es válida.
				</span>
			)}
		</form>
	);
}
