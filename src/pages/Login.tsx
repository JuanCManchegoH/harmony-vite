import { KeyIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button, Subtitle, TextInput } from "@tremor/react";
import { useEffect, useState } from "react";
import Background from "../common/Background";
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
			<Player
				src="https://lottie.host/b83ec7da-2180-410c-abfd-da574078a863/1KdE2tEL0F.json"
				className="player"
				autoplay
				loop
				style={{
					height: "120px",
					width: "120px",
					position: "absolute",
					right: "0",
					bottom: "0",
					zIndex: 10,
				}}
			/>
			<section className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 z-10">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm z-10">
					<div className="flex flex-col items-center justify-center">
						<img
							src="harmony-logo.png"
							alt="Harmony"
							className=" h-20 w-auto"
						/>
					</div>
					<Subtitle
						className="mt-5 text-center text-lg font-bold leading-9 tracking-tight text-gray-900"
						color="gray"
					>
						Iniciar sesión
					</Subtitle>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm z-10">
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
			<Background />
		</>
	);
}
