import TimeComparer, {
    TimeDescriptor,
} from '../../../Platform/_times/TimeComparer';
import { EventCardType, EventType, TimeInfoType } from './_types/EventCardType';
import { ExpanderClickHandlerType } from '../../screens/home/Home';
import { Icons } from '../../../Platform/_types/Icons';
import { SyntheticEvent } from 'react';
import './EventCardStyle.css';
import clsx from 'clsx';

export type EventCardClickHandlerType = (id: string, eventType: EventType) => void;

type EventCardProps = {
    item: EventCardType;

    /**
     * Обработчик клика по кнопки "Развернуть", которая есть только на карточке проекта
     */
    expanderClickHandler: ExpanderClickHandlerType;

    /**
     * Обработчик клика по карточке события (задачи или проекта)
     */
    cardClikHandler: EventCardClickHandlerType;

    /**
     * Идентификатор события (задачи или проекта)
     */
    id: string;

    /**
     * Развернут ли проект на задачи
     */
    expanded: boolean;

    /**
     * Тип информации о времени.
     *
     * Возможные варианты:
     * * None - Нет информации о времени
     * * Common - На карточке две плашки вермени (плановое и фактическое)
     * * ThreeWeeks - Расстановка времени по трём неделям и общее время (всего 4 пары)
     * * FourWeeks - Расстановка времени по четырем неделям и общее время (всего 5 пар)
     */
    timeType: TimeInfoType;
};

// TODO: будем задавать для карточек задач указатель project: uuid, т.е. указание на карточку проекта
// возможно, задача без проекта - тогда укажем в parent null

function EventCard({
    item,
    id,
    expanded,
    timeType,
    expanderClickHandler,
    cardClikHandler
}: EventCardProps) {
    const PROJECT_INCLUDES_TASKS = item.type === EventType.Project;
    const mainCN = 'eventCard';
    const wrapperCN = clsx(
        mainCN,
        item.type === EventType.Project && `${mainCN}_project`
    );
    const sideBarCN = clsx(
        `${mainCN}__sidebar`,
        item.type === EventType.Project && `${mainCN}__sidebar_${item.color}`
    );
    const cardContentCN = clsx(`${mainCN}__cardContent`);
    const headerCN = clsx(`${mainCN}__header`);
    const titleCN = clsx(`${mainCN}__title`);
    const expanderIconCN = clsx(
        `${mainCN}__expanderIcon`,
        expanded && `${mainCN}__expanderIcon_rotated`
    );
    const timeInfoCN = clsx(`${mainCN}__timeInfo`);
    const separatorCN = clsx(`${mainCN}__timeSeparator`);
    const noneTimeCN = clsx(`${mainCN}__noneTime`);
    const expanderBtnCN = clsx(`${mainCN}__expanderButton`);

    const timeInfo = _getTimeInfoComponent(
        timeType,
        separatorCN,
        noneTimeCN,
        item.timeValues,
    );

    const expanderButtonClickHandler = (event: SyntheticEvent) => {
        event.stopPropagation();
        expanderClickHandler(id, expanded);
    };

    const cardContentClickHandler = (event: SyntheticEvent) => {
        event.nativeEvent.stopImmediatePropagation();
        cardClikHandler(id, item.type);
    }

    return (
        <div className={wrapperCN}>
            {item.type === EventType.Project && <div className={sideBarCN} />}
            <div className={cardContentCN} onClick={cardContentClickHandler}>
                <div className={headerCN}>
                    <span className={titleCN}>{item.title}</span>
                    {PROJECT_INCLUDES_TASKS && (
                        <button
                            className={expanderBtnCN}
                            onClick={expanderButtonClickHandler}
                        >
                            <img
                                className={expanderIconCN}
                                src={Icons.dropdownArrow}
                            />
                        </button>
                    )}
                </div>
                <div className={timeInfoCN}>{timeInfo.map((item) => item)}</div>
            </div>
        </div>
    );
}

function _getTimeInfoComponent(
    timeInfoType: TimeInfoType,
    separatorCN: string,
    noneTimeCN: string,
    values?: TimeDescriptor[],
): JSX.Element[] {
    const maxIterator: number = timeInfoType * 2;
    const result = [];
    const withoutTimeEl = <div className={noneTimeCN}>Без времени</div>;

    if (values.length < maxIterator) {
        return [withoutTimeEl];
    }

    // TODO: задать key на списочные элементы. нужен uuid?
    for (let i = 0; i < maxIterator; i += 2) {
        result.push(
            <TimeComparer
                firstTime={values[i]}
                secontTime={values[i + 1]}
                horizontal={timeInfoType === TimeInfoType.Common}
            />
        );

        if (
            (timeInfoType === TimeInfoType.FourWeeks ||
                timeInfoType === TimeInfoType.ThreeWeeks) &&
            i === maxIterator - 4
        ) {
            result.push(<div className={separatorCN}></div>);
        }
    }

    if (timeInfoType === TimeInfoType.None) {
        result.push(withoutTimeEl);
    }

    return result;
}

export default EventCard;
