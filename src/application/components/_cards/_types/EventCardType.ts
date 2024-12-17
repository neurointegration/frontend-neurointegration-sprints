import { TimeDescriptor } from "../../../../Platform/_times/TimeComparer";
import { MainColorStatus } from "../../../../Platform/_types/Statuses";

type EventCardBaseType = {
    title: string;

    /**
     * Значения плашек времени. Каждая пара рассматривается как плановое и фактическое время
     *
     * TODO: подумать над моментом переключния недель и обсудить как это будет выглядеть: всегда ли у нас на карточке есть 5 времен?
     * @remark Внимание! Количество пар времени должно совпадать с определением timeType!
     *
     * @example
     * const timeValues: TimeDescriptor[] = [
     *      { value: '12:00' },
     *      { value: '14:00' }
     * ]
     *
     * В первой паре значений:
     * timeValues[0] - плановое время,
     * timeValues[1] - фактическое
     */
    timeValues: TimeDescriptor[];
};

type EventCardProjectType = EventCardBaseType & {
    type: EventType.Project;
    
    /**
     * Цвет соответствует основным вкладкам
     */
    color: MainColorStatus;
};

type EventCardTaskType = EventCardBaseType & {
    type: EventType.Task;
};

/**
 * Тип, описывающий объект карточки события (проект или задача)
 */
export type EventCardType = EventCardProjectType | EventCardTaskType;

/**
 * Вид соыбтийных карточек
 */
export enum EventType {
    /**
     * Карточка проекта
     */
    Project = 'project',

    /**
     * Карточка задачи
     */
    Task = 'task',
}

/**
 * Отражает тип временной информации. Значения указывают на количество пар плашек времени
 */
export enum TimeInfoType {
    /**
     * Нет информации о времени (отображается плашка "Без времени")
     */
    None = 0,

    /**
     * Стандартное отображение одной пары времени (плановое и фактическое)
     */
    Common = 1,

    /**
     * Отображение времени для трёх недель (показвает 3 пары времени и ещё 1 пару - общее время)
     */
    ThreeWeeks = 4,

    /**
     * Отображение времени для четырёх недель (показвает 4 пары времени и ещё 1 пару - общее время)
     */
    FourWeeks = 5,
}