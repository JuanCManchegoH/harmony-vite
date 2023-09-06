import { LockOpenIcon } from "@heroicons/react/24/solid";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "@tremor/react";
import { Link } from "react-router-dom";
import Background from "../common/Background";

export default function Home() {
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
			<header className="absolute inset-x-0 top-0 z-50">
				<nav
					className="flex items-center justify-between p-6 lg:px-8"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<Link to="/" className="-m-1.5 p-1.5">
							<img
								className="h-9 w-auto"
								src="harmony-logo.png"
								alt="Harmony Logo"
							/>
						</Link>
					</div>

					<div className="flex flex-1 justify-end">
						<Link to="/login">
							<Button color="rose" icon={LockOpenIcon} size="sm">
								Iniciciar sesión
							</Button>
						</Link>
					</div>
				</nav>
			</header>
			<div className="relative isolate px-6 lg:px-8">
				<div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 font-rhd">
					<div className="hidden sm:mb-8 sm:flex sm:justify-center">
						<div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
							Ahora puedes apoyarte en nuestro material de apoyo.{" "}
							<a href="/" className="font-bold text-rose-500">
								<span className="absolute inset-0" aria-hidden="true" />
								Documentación <span aria-hidden="true">&rarr;</span>
							</a>
						</div>
					</div>
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl">
							<span className="text-rose-400 font-pacifico">Harmony </span>
							La solución definitiva para gestionar tu personal en misión.
						</h1>
						<p className="mt-6 text-lg leading-8 text-gray-600">
							<span className="font-semibold">
								Olvida las complicaciones de Excel.{" "}
							</span>
							Con Harmony, no solo obtendrás una herramienta para gestionar a tu
							personal, sino que también disfrutarás de trazabilidad, eficiencia
							y procesos automatizados.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Button color="sky">Tutoriales</Button>
							<Link
								to="/login"
								className="text-sm font-semibold leading-6 text-gray-900"
							>
								Ir a la App <span aria-hidden="true">→</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<Background />
		</>
	);
}
