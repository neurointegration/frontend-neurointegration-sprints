import { TimeDescriptorType } from '../../../../core/api/actions/projects';
import { MainSectionType } from '../../../../Platform/_types/Statuses';

type EventCardBaseType = {
    title: string;
    timeValues: {
        planningTimes: TimeDescriptorType;
        factTimes: TimeDescriptorType;
    };
};

type EventCardProjectType = EventCardBaseType & {
    type: EventType.Project;

    /**
     * Цвет соответствует основным вкладкам
     */
    section: MainSectionType;
};

type EventCardTaskType = EventCardBaseType & {
    type: EventType.Task;
};

type EventCardAddTaskType = {
    type: EventType.AddTaskSpecial;
};

/**
 * Тип, описывающий объект карточки события (проект или задача)
 */
export type EventCardType = EventCardProjectType | EventCardTaskType;
export type ExtendedCardType = EventCardType | EventCardAddTaskType;

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

    /**
     * Карточка добавления задачи в проект. По сущности - кнопка в виде карточки
     */
    AddTaskSpecial = 'addTaskSpecial',
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
