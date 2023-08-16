import { KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Button, Subtitle, TextInput, Title } from "@tremor/react";

export default function Login() {
	return (
		<>
			<section className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<Title
						className="grid place-content-center text-2xl mx-auto h-10 w-auto text-yellow-400"
						color="yellow"
					>
						Harmony
					</Title>
					<Subtitle
						className="mt-10 text-center text-lg font-bold leading-9 tracking-tight text-gray-900"
						color="gray"
					>
						Iniciar sesión
					</Subtitle>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6">
						<TextInput
							icon={UserCircleIcon}
							placeholder="Correo electrónico"
							type="email"
						/>
						<TextInput
							icon={KeyIcon}
							placeholder="Contraseña"
							type="password"
						/>
						<div className="flex justify-end">
							<Button size="lg" color="yellow" variant="primary" type="submit">
								Iniciar sesión
							</Button>
						</div>
					</form>
				</div>
			</section>
		</>
	);
}
