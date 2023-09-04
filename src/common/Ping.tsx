export default function Ping() {
	return (
		<span className="absolute right-2">
			<span className="relative flex h-2 w-2">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75" />
				<span className=" inline-flex rounded-full h-2 w-2 bg-sky-400" />
			</span>
		</span>
	);
}
