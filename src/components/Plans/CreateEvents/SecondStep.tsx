import { CreateEvent } from "../../../hooks/Handlers/usePlans";
import CalendarUpdate from "../Stalls/CalendarUpdate";

export default function SecondStep({
	createEvent,
}: {
	createEvent: CreateEvent;
}) {
	return (
		<>
			<CalendarUpdate
				monthDays={createEvent.monthDays}
				selectedDays={createEvent.selectedDays}
				setSelectedDays={createEvent.setSelectedDays}
				data={createEvent.shiftsData}
				setData={createEvent.setShiftsData}
				selectedConvention={createEvent.selectedConvention}
				setSelectedConvention={createEvent.setSelectedConvention}
				event
			/>
		</>
	);
}
