import { TimeType } from "../actions/projects";

export const sumDates = (dates: TimeType[]): TimeType => {
    const time : TimeType = {
        hours: 0,
        minutes: 0,
    }
    dates.map((item) => {
        const tmpMinutes = item.hours * 60 + time.hours * 60 + item.minutes + time.minutes;
        time.hours = Math.floor(tmpMinutes / 60);
        time.minutes = tmpMinutes % 60
    });

    if (time.hours > 99) {
        time.hours = 99;
    }
    return time;
};