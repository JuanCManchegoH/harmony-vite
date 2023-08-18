import axios from "axios";
import Cookie from "js-cookie";
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

	const validateUserData = (user: CreateUser, repeatPassword: string) => {
		const isEmpty = !user.userName || !user.email || !user.password;
		if (isEmpty || user.roles.length === 0) {
			return false;
		}
		if (user.password.length < 8) {
			return false;
		}
		if (user.password !== repeatPassword) {
			return false;
		}
		return true;
	};

	async function createUser(user: CreateUser, repeatPassword: string) {
		if (!validateUserData(user, repeatPassword)) {
			toast.error("Todos los campos con * son obligatorios");
		}
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
			return toast.error("Error al crear el usuario");
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
			return toast.error("Error al actualizar el usuario");
		} finally {
			dispatch(setLoading(false));
		}
	}

	return {
		getUsers,
		getNewUserRoles,
		createUser,
		updateUser,
	};
};
