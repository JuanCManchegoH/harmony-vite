import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
	Badge,
	Button,
	MultiSelect,
	MultiSelectItem,
	Select,
	SelectItem,
	Subtitle,
	Text,
} from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import Avatar from "../common/Avatar";
import RightModal from "../common/RightModal";
import { useAppSelector } from "../hooks/store";
import { useLogs } from "../hooks/useLogs";
import { months, years } from "../utils/dates";

export default function Logs({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const { logs } = useAppSelector((state) => state.logs);
	const {
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
		getLogs,
		selectedTypes,
		setSelectedTypes,
		uniqueTypes,
	} = useLogs(logs);
	return (
		<RightModal open={open} setOpen={setOpen} icon={BellIcon} title="Registro">
			<header className="flex justify-between items-center gap-2 sticky top-0 z-10 bg-gray-50 pb-2">
				<div className="flex gap-2">
					<Select
						value={selectedMonth}
						onValueChange={(value) => setSelectedMonth(value)}
					>
						{months.map((month) => (
							<SelectItem key={`month-${month.value}`} value={month.value}>
								{month.name}
							</SelectItem>
						))}
					</Select>
					<Select
						value={selectedYear}
						onValueChange={(value) => setSelectedYear(value)}
					>
						{years.map((year) => (
							<SelectItem key={`year-${year}`} value={year.value}>
								{year.name}
							</SelectItem>
						))}
					</Select>
					<MultiSelect
						value={selectedTypes}
						onValueChange={(value) => setSelectedTypes(value)}
					>
						{uniqueTypes.map((type) => (
							<MultiSelectItem key={`type-${type}`} value={type}>
								{type}
							</MultiSelectItem>
						))}
					</MultiSelect>
				</div>
				<Button
					icon={MagnifyingGlassIcon}
					size="xs"
					color="sky"
					onClick={() => getLogs()}
				>
					Buscar
				</Button>
			</header>
			<ul className="flex flex-col gap-2">
				{logs
					.filter((log) => selectedTypes.includes(log.type))
					.map((log) => (
						<li className="p-2 border rounded-md">
							<header className="flex justify-between items-center border-b pb-2">
								<Text>Nuevo registro</Text>
								<Badge color="sky">{log.type}</Badge>
							</header>
							<main className="mt-2">
								<div className="p-2 text-sm border rounded-md">
									<Subtitle>Descripción</Subtitle>
									<Text>{log.message}</Text>
								</div>
							</main>
							<footer className="mt-2 flex justify-between border-t pt-2">
								<span className="col-span-2 flex items-center gap-2">
									<Avatar
										size="xs"
										title={log.userName}
										letter={log.userName[0]}
									/>
									<Text>{log.userName}</Text>
								</span>
								<Subtitle className="flex text-xs items-center">
									{log.createdAt}
								</Subtitle>
							</footer>
						</li>
					))}
			</ul>
		</RightModal>
	);
}
