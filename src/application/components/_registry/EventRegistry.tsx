import { ExpanderClickHandlerType } from '../../screens/Home';
import { EventCardType, TimeInfoType } from '../_cards/_types/EventCardType';
import EventCard from '../_cards/EventCard';
import './EventRegistryStyle.css';
import clsx from 'clsx';

const WEEK1 = 'Н1';
const WEEK2 = 'Н2';
const WEEK3 = 'Н3';
const WEEK4 = 'Н4';
const TOTAL = 'Всего';

export type RegistryItemType = {
    item: EventCardType;

    /**
     * Идентификатор события (проекта или задачи)
     */
    id: string;

    /**
     * Если событие задача - здесь указан uuid ПРОЕКТА,
     * к окторому она относится. Если преокт - null
     */
    project: string | null;

    /**
     * Развернут ли проект
     * Примечание: false для событий задач
     */
    projectExpanded: boolean;
};

type EventRegistryProps = {
    items: RegistryItemType[];
    timeType: TimeInfoType;
    expanderClickHandler: ExpanderClickHandlerType;
};

function EventRegistry({
    items,
    timeType,
    expanderClickHandler,
}: EventRegistryProps) {
    const showWeeksHeader =
        timeType === TimeInfoType.ThreeWeeks ||
        timeType === TimeInfoType.FourWeeks;
    const baseCN = 'eventRegistry';
    const wrapperCN = clsx(`${baseCN}__wrapper`);
    const weeksHeaderCN = clsx(`${baseCN}__weeksHeader`);
    const weeksHeaderWeekCN = clsx(`${weeksHeaderCN}_week`);

    return (
        <div className={wrapperCN}>
            <div className={baseCN}>
                {showWeeksHeader && (
                    <div className={weeksHeaderCN}>
                        <div className={weeksHeaderWeekCN}>{WEEK1}</div>
                        <div className={weeksHeaderWeekCN}>{WEEK2}</div>
                        <div className={weeksHeaderWeekCN}>{WEEK3}</div>
                        {timeType === TimeInfoType.FourWeeks && (
                            <div className={weeksHeaderWeekCN}>{WEEK4}</div>
                        )}
                        <div></div>
                        <div className={weeksHeaderWeekCN}>{TOTAL}</div>
                    </div>
                )}
                <div>
                    {items.map((event) => (
                        <EventCard
                            item={event.item}
                            id={event.id}
                            expanded={event.projectExpanded}
                            timeType={timeType}
                            expanderClickHandler={expanderClickHandler}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EventRegistry;
