import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "@tremor/react";
import { Link } from "wouter";
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
			<section className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 z-10">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm z-10">
					<div className="flex flex-col items-center justify-center">
						<img
							src="harmony-logo.png"
							alt="Harmony"
							className=" h-20 w-auto"
						/>
					</div>
				</div>
			</section>
			<Background />
			<Link href="/login">
				<Button color="rose" className="absolute top-4 right-4">
					Iniciar sesión
				</Button>
			</Link>
		</>
	);
}
