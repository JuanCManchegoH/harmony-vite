export default function Avatar({
	title,
	letter,
}: { title: string; letter: string }) {
	return (
		<div
			className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 border-2 border-rose-600"
			title={title}
		>
			<span className="leading-none text-white text-sm font-pacifico uppercase">
				{letter}
			</span>
		</div>
	);
}
