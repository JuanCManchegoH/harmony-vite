export const hours = Array.from(Array(25).keys()).slice(1);
export const minutes = Array.from(Array(61).keys());

export const getHour = (hour: string) => {
	if (hour.length === 1) {
		return `0${hour}`;
	}
	return hour;
};

export const getSchedules = (
	shifts: { startTime: string; endTime: string }[],
) => {
	const schedules = shifts.reduce((acc, shift) => {
		const schedule = {
			startTime: shift.startTime,
			endTime: shift.endTime,
		};
		const exist = acc.find(
			(accSchedule) =>
				accSchedule.startTime === schedule.startTime &&
				accSchedule.endTime === schedule.endTime,
		);
		if (schedule.startTime === schedule.endTime) return acc;
		if (!exist) acc.push(schedule);
		return acc;
	}, [] as { startTime: string; endTime: string }[]);
	return schedules;
};

export const getDiference = (startTime: string, endTime: string) => {
	const [startHour, startMinute] = startTime.split(":").map(Number);
	const [endHour, endMinute] = endTime.split(":").map(Number);

	let hours = endHour - startHour;
	let minutes = endMinute - startMinute;

	if (minutes < 0) {
		hours -= 1;
		minutes += 60;
	}

	if (hours < 0) {
		hours += 24;
	}

	const totalMinutes = hours * 60 + minutes;

	const strHours = hours.toString().padStart(2, "0");
	const strMinutes = minutes.toString().padStart(2, "0");

	return {
		hours,
		minutes: totalMinutes,
		str: `${strHours}:${strMinutes}`,
	};
};

export const minutesToString = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	const strHours = hours.toString().padStart(2, "0");
	const strMins = mins.toString().padStart(2, "0");
	return `${strHours}:${strMins}`;
};
