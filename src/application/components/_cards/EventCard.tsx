import TimeComparer from '../../../Platform/_times/TimeComparer';
import { EventCardType, EventType, TimeInfoType } from './_types/EventCardType';
import { ExpanderClickHandlerType } from '../../screens/home/Sprint';
import { Icons } from '../../../Platform/_types/Icons';
import { Fragment, SyntheticEvent } from 'react';
import './EventCardStyle.css';
import clsx from 'clsx';
import {
    TaskOrProjectTimeDescriptorType,
    TimeType,
} from '../../../core/api/actions/projects';
import { useRecoilValue } from 'recoil';
import MeInformationAtom from '../../../core/atoms/me.atom';
import { RegistryItemType } from '../_registry/EventRegistry';

export type EventCardClickHandlerType = (event: RegistryItemType) => void;

type EventCardProps = {
    /**
     * Дескриптор события
     */
    event: RegistryItemType;

    /**
     * Обработчик клика по кнопки "Развернуть", которая есть только на карточке проекта
     */
    expanderClickHandler: ExpanderClickHandlerType;

    /**
     * Обработчик клика по карточке события (задачи или проекта)
     */
    cardClikHandler: EventCardClickHandlerType;

    /**
     * Времена какой недели отображать на карточке.
     * Например, если выбрана "Неделя 1", следует передать 1
     * Если выбраны "Все недели", следует передать null
     */
    weekToShow?: 1 | 2 | 3 | 4 | null;
};

function EventCard({
    weekToShow,
    event,
    expanderClickHandler,
    cardClikHandler,
}: EventCardProps) {
    const PROJECT_INCLUDES_TASKS = event.item.type === EventType.Project;
    const mainCN = 'eventCard';
    const wrapperCN = clsx(
        mainCN,
        event.item.type === EventType.Project && `${mainCN}_project`
    );
    const sideBarCN = clsx(
        `${mainCN}__sidebar`,
        event.item.type === EventType.Project &&
            `${mainCN}__sidebar_${event.item.section}`
    );
    const cardContentCN = clsx(`${mainCN}__cardContent`);
    const headerCN = clsx(`${mainCN}__header`);
    const titleCN = clsx(`${mainCN}__title`);
    const expanderIconCN = clsx(
        `${mainCN}__expanderIcon`,
        event.projectExpanded && `${mainCN}__expanderIcon_rotated`
    );
    const timeInfoCN = clsx(`${mainCN}__timeInfo`);
    const separatorCN = clsx(`${mainCN}__timeSeparator`);
    const noneTimeCN = clsx(`${mainCN}__noneTime`);
    const expanderBtnCN = clsx(`${mainCN}__expanderButton`);

    const meInformation = useRecoilValue(MeInformationAtom);

    const timeInfo = _getTimeInfoComponent(
        weekToShow,
        meInformation.sprintWeeksCount,
        separatorCN,
        noneTimeCN,
        (event.item as EventCardType).timeValues
    );

    const expanderButtonClickHandler = (e: SyntheticEvent) => {
        e.stopPropagation();
        expanderClickHandler(
            event.id,
            event.projectExpanded,
            event.sectionName
        );
    };

    const cardContentClickHandler = (e: SyntheticEvent) => {
        e.nativeEvent.stopImmediatePropagation();
        cardClikHandler(event);
    };

    return (
        <div className={wrapperCN}>
            {event.item.type === EventType.Project && (
                <div className={sideBarCN} />
            )}
            <div className={cardContentCN} onClick={cardContentClickHandler}>
                <div className={headerCN}>
                    <span className={titleCN}>
                        {(event.item as EventCardType).title}
                    </span>
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
                        <Fragment
                            key={`timeComparer_event_${event.id}_${index}`}
                        >
                            {item}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

function _getTimeInfoComponent(
    weekToShow: 1 | 2 | 3 | 4 | null,
    sprintWeeksCount: number,
    separatorCN: string,
    noneTimeCN: string,
    values: {
        planningTimes: TaskOrProjectTimeDescriptorType;
        factTimes: TaskOrProjectTimeDescriptorType;
    }
): JSX.Element[] {
    const planningTimes = values.planningTimes;
    const factTimes = values.factTimes;
    const withoutTimeEl = <div className={noneTimeCN}>Без времени</div>;

    // TODO: проверить старое условие было:
    // if ((!planningTimes && !factTimes) || !chosedPeriod) {
    if (!planningTimes && !factTimes) {
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
    if (weekToShow === null) {
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

    // const chosedPeriodIndexMapper = {
    //     [CurrentSprintDropdownValue.week1]: 0,
    //     [CurrentSprintDropdownValue.week2]: 1,
    //     [CurrentSprintDropdownValue.week3]: 2,
    //     [CurrentSprintDropdownValue.week4]: 3,
    // };

    const neededItem = timeComparerItems[weekToShow - 1];

    if (weekToShow === timeComparerItems.length) {
        return [withoutTimeEl];
    }

    return [
        <TimeComparer
            horizontal
            times={{
                planning: neededItem?.planning,
                fact: neededItem?.fact,
            }}
        />,
    ];
}

export default EventCard;
