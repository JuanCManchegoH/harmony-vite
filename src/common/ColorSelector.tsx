import { RadioGroup } from "@headlessui/react";
import classNames from "../utils/classNames";
import { ColorGroup } from "../utils/colors";

export default function ColorSelector({
	colorsGroup,
	selectedColor,
	setSelectedColor,
}: {
	colorsGroup: ColorGroup[];
	selectedColor: ColorGroup;
	setSelectedColor: (color: ColorGroup) => void;
}) {
	return (
		<RadioGroup value={selectedColor} onChange={setSelectedColor}>
			<div className="flex items-center space-x-1">
				{colorsGroup.map((color) => (
					<RadioGroup.Option
						key={color.name}
						title={color.name}
						value={color}
						className={({ active, checked }) =>
							classNames(
								color.selectedColor,
								active || checked ? "ring ring-inset" : "",
								// !active && checked ? "ring-2" : "",
								"relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none",
							)
						}
					>
						<span
							aria-hidden="true"
							className={classNames(
								color.bgColor,
								"h-5 w-5 rounded-full border border-black border-opacity-10",
							)}
						/>
					</RadioGroup.Option>
				))}
			</div>
		</RadioGroup>
	);
}
