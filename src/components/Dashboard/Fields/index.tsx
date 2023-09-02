import { IdentificationIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Badge } from "@tremor/react";
import { useState } from "react";
import CustomToggle from "../../../common/CustomToggle";
import FieldsSection from "./FieldsSection";

export default function Fields() {
	const [enabled, setEnabled] = useState(false);
	const values = {
		enabled: IdentificationIcon,
		disabled: UserGroupIcon,
	};
	return (
		<section>
			{/* one item to left and the other to right */}
			<header className="flex my-2 items-center justify-between">
				<Badge size="xl" color="sky" className="font-semibold">
					{!enabled ? "Clientes" : "Personal"}
				</Badge>
				<CustomToggle
					enabled={enabled}
					setEnabled={setEnabled}
					values={values}
				/>
			</header>
			{enabled && <FieldsSection type="workers" />}
			{!enabled && <FieldsSection type="customers" />}
		</section>
	);
}
