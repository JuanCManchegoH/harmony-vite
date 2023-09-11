// Interfaces
interface InsetLabelProps {
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	label: string;
	placeholder: string;
	type: string;
}

interface MultiSelectProps {
	value?: string[];
	onValueChange?: (value: string[]) => void;
	placeholder: string;
	items: { key: string; value: string; name: string }[];
}

// Components
function InsetLabel({
	label,
	type,
	placeholder,
	value,
	onChange,
}: InsetLabelProps) {
	return (
		<div className="rounded-md px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-600 text-left">
			<label htmlFor="name" className="block text-xs font-medium text-gray-900">
				{label}
			</label>
			<input
				type={type}
				value={value}
				onChange={onChange}
				className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
				placeholder={placeholder}
			/>
		</div>
	);
}

export { InsetLabel };
