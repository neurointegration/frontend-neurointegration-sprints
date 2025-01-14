import { EventType, ExtendedCardType } from '../_cards/_types/EventCardType';
import EventCard, { EventCardClickHandlerType } from '../_cards/EventCard';
import { ExpanderClickHandlerType } from '../../screens/home/Sprint';
import Button from '../../../Platform/_buttons/Button';
import { Icons } from '../../../Platform/_types/Icons';
import './EventRegistryStyle.css';
import clsx from 'clsx';
import AddTaskCard from '../_cards/AddTaskCard';
import { useRecoilValue } from 'recoil';
import MeInformationAtom from '../../../core/atoms/me.atom';
import { CurrentSprintDropdownValue } from '../../screens/home/constants';

const WEEK1 = 'Н1';
const WEEK2 = 'Н2';
const WEEK3 = 'Н3';
const WEEK4 = 'Н4';
const TOTAL = 'Всего';

export type RegistryItemType = {
    item: ExtendedCardType | null;

    /**
     * Идентификатор события (проекта или задачи)
     */
    id: string | null;

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
    chosedPeriod: keyof typeof CurrentSprintDropdownValue | null;
    expanderClickHandler: ExpanderClickHandlerType;
    cardClickHandler: EventCardClickHandlerType;
    className?: string;
    newProjectAvailable?: boolean;
};

function EventRegistry({
    items,
    chosedPeriod,
    expanderClickHandler,
    cardClickHandler,
    className,
    newProjectAvailable,
}: EventRegistryProps) {
    const meInformation = useRecoilValue(MeInformationAtom);

    const showWeeksHeader =
        chosedPeriod === CurrentSprintDropdownValue.allWeeks;
    const baseCN = 'eventRegistry';
    const wrapperCN = clsx(`${baseCN}__wrapper`, className && className);
    const weeksHeaderCN = clsx(`${baseCN}__weeksHeader`);
    const weeksHeaderWeekCN = clsx(`${weeksHeaderCN}_week`);
    const addProjectButtonCN = clsx(
        `${baseCN}__addproject`,
        'controls-fontsize-l',
        'controls-fontweight-medium'
    );
    return (
        <div className={wrapperCN}>
            <div className={baseCN}>
                {newProjectAvailable && (
                    <Button
                        className={addProjectButtonCN}
                        icon={Icons.plus}
                        showMode='common'
                        caption='Добавить новый проект'
                    />
                )}
                {showWeeksHeader && (
                    <div className={weeksHeaderCN}>
                        <div className={weeksHeaderWeekCN}>{WEEK1}</div>
                        <div className={weeksHeaderWeekCN}>{WEEK2}</div>
                        <div className={weeksHeaderWeekCN}>{WEEK3}</div>
                        {meInformation.sprintWeeksCount === 4 && (
                            <div className={weeksHeaderWeekCN}>{WEEK4}</div>
                        )}
                        <div></div>
                        <div className={weeksHeaderWeekCN}>{TOTAL}</div>
                    </div>
                )}
                <div>
                    {items.map((event) => {
                        if (event.item.type === EventType.AddTaskSpecial) {
                            return (
                                <AddTaskCard
                                    key={event.id}
                                    project={event.project}
                                />
                            );
                        } else {
                            return (
                                <EventCard
                                    key={event.id}
                                    item={event.item}
                                    id={event.id}
                                    expanded={event.projectExpanded}
                                    chosedPeriod={chosedPeriod}
                                    expanderClickHandler={expanderClickHandler}
                                    cardClikHandler={cardClickHandler}
                                />
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}

export default EventRegistry;
