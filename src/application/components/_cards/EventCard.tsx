import TimeComparer from '../../../Platform/_times/TimeComparer';
import { EventCardType, EventType, TimeInfoType } from './_types/EventCardType';
import { ExpanderClickHandlerType } from '../../screens/home/Sprint';
import { Icons } from '../../../Platform/_types/Icons';
import { Fragment, SyntheticEvent } from 'react';
import './EventCardStyle.css';
import clsx from 'clsx';
import {
    TimeDescriptorType,
    TimeType,
} from '../../../core/api/actions/projects';
import { useRecoilValue } from 'recoil';
import MeInformationAtom from '../../../core/atoms/me.atom';
import { CurrentSprintDropdownValue } from '../../screens/home/constants';

export type EventCardClickHandlerType = (
    id: string,
    item: EventCardType
) => void;

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
     * Выбранный период в дропдауне дял отображение (Неделя 1, Неделя 2, ...)
     */
    chosedPeriod: keyof typeof CurrentSprintDropdownValue;
};

// TODO: будем задавать для карточек задач указатель project: uuid, т.е. указание на карточку проекта
// возможно, задача без проекта - тогда укажем в parent null

function EventCard({
    item,
    id,
    expanded,
    chosedPeriod,
    expanderClickHandler,
    cardClikHandler,
}: EventCardProps) {
    const PROJECT_INCLUDES_TASKS = item.type === EventType.Project;
    const mainCN = 'eventCard';
    const wrapperCN = clsx(
        mainCN,
        item.type === EventType.Project && `${mainCN}_project`
    );
    const sideBarCN = clsx(
        `${mainCN}__sidebar`,
        item.type === EventType.Project && `${mainCN}__sidebar_${item.section}`
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

    const meInformation = useRecoilValue(MeInformationAtom);

    const timeInfo = _getTimeInfoComponent(
        chosedPeriod,
        meInformation.sprintWeeksCount,
        separatorCN,
        noneTimeCN,
        item.timeValues
    );

    const expanderButtonClickHandler = (event: SyntheticEvent) => {
        event.stopPropagation();
        expanderClickHandler(id, expanded);
    };

    const cardContentClickHandler = (event: SyntheticEvent) => {
        event.nativeEvent.stopImmediatePropagation();
        cardClikHandler(id, item);
    };

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
                <div className={timeInfoCN}>
                    {timeInfo.map((item, index) => (
                        <Fragment key={`timeComparer_event_${id}_${index}`}>
                            {item}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

function _getTimeInfoComponent(
    chosedPeriod: keyof typeof CurrentSprintDropdownValue,
    sprintWeeksCount: number,
    separatorCN: string,
    noneTimeCN: string,
    values: {
        planningTimes: TimeDescriptorType;
        factTimes: TimeDescriptorType;
    }
): JSX.Element[] {
    const planningTimes = values.planningTimes;
    const factTimes = values.factTimes;
    const withoutTimeEl = <div className={noneTimeCN}>Без времени</div>;

    if ((!planningTimes && !factTimes) || !chosedPeriod) {
        return [withoutTimeEl];
    }

    const result: JSX.Element[] = [];
    const possibleKeys = ['1', '2', '3']
        .concat(sprintWeeksCount === TimeInfoType.FourWeeks ? ['4'] : [])
        .concat(['total']);
    const timeComparerItems: {
        planning: null | TimeType;
        fact: null | TimeType;
    }[] = [];

    possibleKeys.map((key) => {
        let timeItem = { planning: null, fact: null };

        if (planningTimes && key in planningTimes) {
            timeItem = { ...timeItem, planning: planningTimes[key] };
        }

        if (factTimes && key in factTimes) {
            timeItem = { ...timeItem, fact: factTimes[key] };
        }

        timeComparerItems.push(timeItem);
    });

    // Если выбрано отображение всех недель - их и отобразим
    if (chosedPeriod === CurrentSprintDropdownValue.allWeeks) {
        timeComparerItems.map((item) => {
            result.push(
                <TimeComparer
                    times={{ planning: item.planning, fact: item.fact }}
                />
            );
        });

        result.splice(-1, 0, <div className={separatorCN} />);
        return result;
    }

    const chosedPeriodIndexMapper = {
        [CurrentSprintDropdownValue.week1]: 0,
        [CurrentSprintDropdownValue.week2]: 1,
        [CurrentSprintDropdownValue.week3]: 2,
        [CurrentSprintDropdownValue.week4]: 3,
    };

    const neededItem = timeComparerItems[chosedPeriodIndexMapper[chosedPeriod]];

    return [
        <TimeComparer
            horizontal
            times={{
                planning: neededItem.planning,
                fact: neededItem.fact,
            }}
        />,
    ];
}

// function _getTimeInfoComponent(
//     timeInfoType: TimeInfoType,
//     separatorCN: string,
//     noneTimeCN: string,
//     values?: TimeDescriptor[]
// ): JSX.Element[] {
//     const maxIterator: number = timeInfoType * 2;
//     const result = [];
//     const withoutTimeEl = <div className={noneTimeCN}>Без времени</div>;

//     if (values.length < maxIterator) {
//         return [withoutTimeEl];
//     }

//     // TODO: задать key на списочные элементы. нужен uuid?
//     for (let i = 0; i < maxIterator; i += 2) {
//         result.push(
//             <TimeComparer
//                 firstTime={values[i]}
//                 secontTime={values[i + 1]}
//                 horizontal={timeInfoType === TimeInfoType.Common}
//             />
//         );

//         if (
//             (timeInfoType === TimeInfoType.FourWeeks ||
//                 timeInfoType === TimeInfoType.ThreeWeeks) &&
//             i === maxIterator - 4
//         ) {
//             result.push(<div className={separatorCN}></div>);
//         }
//     }

//     if (timeInfoType === TimeInfoType.None) {
//         result.push(withoutTimeEl);
//     }

//     return result;
// }

export default EventCard;
