import { KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Button, Subtitle, TextInput, Title } from "@tremor/react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
	const [data, setData] = useState({ email: "", password: "" });
	const { login, getProfile } = useAuth();

	useEffect(() => {
		getProfile();
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login(data.email, data.password);
	};

	return (
		<>
			<section className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<Title
						className="grid place-content-center text-5xl font-black mx-auto h-10 w-auto text-red-500 font-rhd"
						color="yellow"
					>
						Harmony
					</Title>
					<Subtitle
						className="mt-5 text-center text-lg font-bold leading-9 tracking-tight text-gray-900"
						color="gray"
					>
						Iniciar sesión
					</Subtitle>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<TextInput
							icon={UserCircleIcon}
							placeholder="Correo electrónico"
							type="email"
							value={data.email}
							onChange={(e) => setData({ ...data, email: e.target.value })}
						/>
						<TextInput
							icon={KeyIcon}
							placeholder="Contraseña"
							type="password"
							value={data.password}
							onChange={(e) => setData({ ...data, password: e.target.value })}
						/>
						<div className="flex justify-end">
							<Button
								size="lg"
								color="gray"
								variant="primary"
								type="submit"
								className="bg-gray-900"
							>
								Iniciar sesión
							</Button>
						</div>
					</form>
				</div>
			</section>
		</>
	);
}
