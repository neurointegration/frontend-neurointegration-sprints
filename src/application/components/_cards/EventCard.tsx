import clsx from 'clsx';
import TimeComparer, {
    TimeDescriptor,
} from '../../../Platform/_times/TimeComparer';
import { Icons } from '../../../Platform/_types/Icons';
import './EventCardStyle.css';
import { EventCardType, EventType, TimeInfoType } from './_types/EventCardType';

type EventCardProps = {
    item: EventCardType;

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

// TODO: заменить на реальное условие наличия задач в проекте
const PROJECT_INCLUDES_TASKS = true;

// TODO: будем задавать для карточек задач указатель parent: uuid, т.е. указание на карточку проекта
// возможно, задача без проекта - тогда укажем в parent null

function EventCard({ item, timeType }: EventCardProps) {
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
    const expanderIconCN = clsx(`${mainCN}__expanderIcon`);
    const timeInfoCN = clsx(`${mainCN}__timeInfo`);
    const separatorCN = clsx(`${mainCN}__timeSeparator`);
    const noneTimeCN = clsx(`${mainCN}__noneTime`);
    const expanderBtnCN = clsx(`${mainCN}__expanderButton`);

    const timeInfo = _getTimeInfoComponent(
        timeType,
        item.timeValues,
        separatorCN,
        noneTimeCN
    );

    const expanderClickHandler = () => {};

    return (
        <div className={wrapperCN}>
            {item.type === EventType.Project && <div className={sideBarCN} />}
            <div className={cardContentCN}>
                <div className={headerCN}>
                    <span className={titleCN}>{item.title}</span>
                    {PROJECT_INCLUDES_TASKS && (
                        <button
                            className={expanderBtnCN}
                            onClick={expanderClickHandler}
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
    values: TimeDescriptor[],
    separatorCN: string,
    noneTimeCN: string
): JSX.Element[] {
    const maxIterator: number = timeInfoType * 2;
    const result = [];

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
        result.push(<div className={noneTimeCN}>Без времени</div>);
    }

    return result;
}

export default EventCard;
