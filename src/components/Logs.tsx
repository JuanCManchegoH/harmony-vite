import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Button, Select, SelectItem } from "@tremor/react";
import { Dispatch, SetStateAction } from "react";
import Label from "../common/Label";
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
	} = useLogs();
	return (
		<RightModal open={open} setOpen={setOpen} icon={BellIcon} title="Registro">
			<header className="flex justify-between items-center gap-2 sticky top-0 z-10">
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
			<ul className="flex flex-col gap-2 mt-2">
				{logs.map((log) => (
					<li key={log.id} className="p-2 border rounded-md">
						<header className="flex justify-between border-b pb-2">
							<div className="flex gap-2">
								<div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500">
									<span className="leading-none text-xs text-white font-pacifico">
										{log.userName[0]}
									</span>
								</div>
								<p className="flex text-sm items-center">{log.userName}</p>
							</div>
							<div className="flex items-center gap-2">
								<p className="flex text-xs items-center">{log.createdAt}</p>
							</div>
						</header>
						<main className="mt-4">
							<Label text="Descripción">
								<div className="p-2 text-sm border rounded-md">
									{log.message}
								</div>
							</Label>
						</main>
					</li>
				))}
			</ul>
		</RightModal>
	);
}
