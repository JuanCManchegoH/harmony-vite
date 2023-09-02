import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { Profile } from "../services/auth/types";
import { setLoading, setUsers } from "../services/users/slice";
import { CreateUser, UpdateUser, UsersWithId } from "../services/users/types";
import { roles } from "../utils/roles";
import { useAppDispatch } from "./store";

export const useUsers = (profile: Profile, users: UsersWithId[]) => {
	const dispatch = useAppDispatch();
	const companyId = profile.company.id;

	const getUsers = async () => {
		dispatch(setLoading(true));
		const access_token = Cookie.get("access_token");
		try {
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.get<UsersWithId[]>(
				api.users.getByCompany(companyId),
			);
			dispatch(setUsers(data));
		} catch {
		} finally {
			dispatch(setLoading(false));
		}
	};

	async function createUser(user: CreateUser) {
		try {
			dispatch(setLoading(true));
			user.company = companyId;
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.post<UsersWithId>(api.users.create, user);
			dispatch(setUsers([...users, data]));
			toast.success("Usuario creado correctamente");
			return data;
		} catch (error) {
			toast.error("Error al crear el usuario");
		} finally {
			dispatch(setLoading(false));
		}
	}

	async function updateUser(user: UpdateUser, id: string) {
		try {
			dispatch(setLoading(true));
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.put<UsersWithId>(api.users.update(id), user);
			const newUsers = users.map((u) => (u.id === id ? data : u));
			dispatch(setUsers(newUsers));
			toast.success("Usuario actualizado correctamente");
			return data;
		} catch (error) {
			toast.error("Error al actualizar el usuario");
		} finally {
			dispatch(setLoading(false));
		}
	}

	async function deleteUser(id: string) {
		try {
			dispatch(setLoading(true));
			const access_token = Cookie.get("access_token");
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			await axios.delete(api.users.delete(id));
			const newUsers = users.filter((u) => u.id !== id);
			dispatch(setUsers(newUsers));
			return toast.success("Usuario eliminado correctamente");
		} catch (error) {
			toast.error("Error al eliminar el usuario");
		} finally {
			dispatch(setLoading(false));
		}
	}

	return {
		getUsers,
		createUser,
		updateUser,
		deleteUser,
	};
};

export const useHandleUser = (user?: UsersWithId) => {
	const [data, setData] = useState<CreateData>({
		userName: user?.userName || "",
		email: user?.email || "",
		company: user?.company || "",
		password: "",
		repPassword: "",
		selectedRoles: user
			? roles
					.filter((role) => role.roles.every((r) => user?.roles.includes(r)))
					.map((role) => role.name)
			: [],
		selectedCustomers: user ? user.customers : [],
		selectedWorkers: user ? user.workers : [],
	});
	const resetData = () => {
		setData({
			userName: "",
			email: "",
			company: "",
			password: "",
			repPassword: "",
			selectedRoles: [],
			selectedCustomers: [],
			selectedWorkers: [],
		});
	};

	const getNewUserRoles = (selectedRoles: string[]) => {
		const newUserRoles: string[] = [];
		for (const role of selectedRoles) {
			const foundRole = roles.find((r) => r.name === role);
			if (foundRole) {
				for (const r of foundRole.roles) {
					if (!newUserRoles.includes(r)) newUserRoles.push(r);
				}
				for (const r of foundRole.dependencies) {
					if (!newUserRoles.includes(r)) newUserRoles.push(r);
				}
			}
		}
		return newUserRoles;
	};
	const handleCreateUser = (
		createUser: (user: CreateUser) => Promise<UsersWithId | undefined>,
	) => {
		// Validations
		const isEmpty = !data.userName || !data.email || !data.password;
		if (isEmpty || data.selectedRoles.length === 0) {
			return toast.message("Datos incompletos", {
				description:
					"Asegurese de llenar todos los campos y asignar al menos un rol",
			});
		}
		if (data.password.length < 8) {
			return toast.message("Contraseña muy corta", {
				description: "La contraseña debe tener al menos 8 caracteres",
			});
		}
		if (data.password !== data.repPassword) {
			return toast.message("Las contraseñas no coinciden", {
				description: "Asegurese de que las contraseñas coincidan",
			});
		}
		//Action
		const newUserRoles = getNewUserRoles(data.selectedRoles);
		const { repPassword, ...user } = data;
		createUser({
			...user,
			roles: newUserRoles,
			customers:
				data.selectedCustomers.length === 0 ? ["all"] : data.selectedCustomers,
			workers:
				data.selectedWorkers.length === 0 ? ["all"] : data.selectedWorkers,
		}).then((res) => {
			if (res) resetData();
		});
	};

	const handleUpdateUser = (
		updateUser: (
			user: UpdateUser,
			id: string,
		) => Promise<UsersWithId | undefined>,
		id: string,
	) => {
		// Validations
		const isEmpty = !data.userName || !data.email;
		if (isEmpty || data.selectedRoles.length === 0) {
			return toast.message("Datos incompletos", {
				description:
					"Asegurese de llenar todos los campos y asignar al menos un rol",
			});
		}
		// Action
		const newUserRoles = getNewUserRoles(data.selectedRoles);
		updateUser(
			{
				...data,
				roles: newUserRoles,
				customers:
					data.selectedCustomers.length === 0
						? ["all"]
						: data.selectedCustomers,
				workers:
					data.selectedWorkers.length === 0 ? ["all"] : data.selectedWorkers,
				active: true,
			},
			id,
		);
	};

	return {
		data,
		setData,
		resetData,
		handleCreateUser,
		handleUpdateUser,
	};
};

export interface CreateData {
	userName: string;
	email: string;
	company: string;
	password: string;
	repPassword: string;
	selectedRoles: string[];
	selectedCustomers: string[];
	selectedWorkers: string[];
}
