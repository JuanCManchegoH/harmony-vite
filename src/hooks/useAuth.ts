import axios from "axios";
import Cookie from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../services/api";
import { setLoading, setProfile, setToken } from "../services/auth/slice";
import { Profile, Token } from "../services/auth/types";
import { useAppDispatch } from "./store";

export const useAuth = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation().pathname;

	const getProfile = async () => {
		const access_token = Cookie.get("access_token");

		if (!access_token || location === "/") {
			navigate("/login");
			return;
		}

		dispatch(setLoading(true));

		try {
			axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			const { data } = await axios.get<Profile>(api.auth.profile);
			dispatch(setProfile(data));
			if (location === "/login") {
				navigate("/dashboard");
			}
		} catch {
			Cookie.remove("access_token");
			dispatch(setToken(""));
			navigate("/login");
		} finally {
			dispatch(setLoading(false));
		}
	};

	// Check access token and location
	if (location !== "/" && location !== "/login") {
		const access_token = Cookie.get("access_token");
		if (!access_token) {
			navigate("/login");
		}
	}

	const login = async (email: string, password: string) => {
		dispatch(setLoading(true));
		try {
			const { data } = await axios.post<{ access_token: Token }>(
				api.auth.login,
				{
					email,
					password,
				},
			);
			Cookie.set("access_token", data.access_token);
			dispatch(setToken(data.access_token));
			toast.success("Bienvenido");
			getProfile();
		} catch {
			toast.error("Email o contraseña incorrectos");
			Cookie.remove("access_token");
			dispatch(setToken(""));
		}
		dispatch(setLoading(false));
	};

	const logout = () => {
		Cookie.remove("access_token");
		dispatch(setToken(""));
		dispatch(setProfile({} as Profile));
		toast.success("Hasta pronto");
		navigate("/login");
	};

	return { getProfile, login, logout };
};
