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
import uuid from 'react-uuid';
import { MainSectionType } from '../../../Platform/_types/Statuses';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { path, Routes } from '../../../core/routing/routes';
import { BaseRegistryType } from '../../screens/home/constants';

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

    /**
     * К какой секции относится проект или задача
     */
    sectionName: MainSectionType;
};

type EventRegistryProps = {
    registryType: BaseRegistryType;
    items: RegistryItemType[];
    weekToShow: 1 | 2 | 3 | 4 | null;
    expanderClickHandler: ExpanderClickHandlerType;
    cardClickHandler: EventCardClickHandlerType;
    className?: string;
    newProjectAvailable?: boolean;
    newTasksAvailable?: boolean;
    activeSection: MainSectionType;
    userSprintId?: string;
};

function EventRegistry({
    registryType,
    items,
    weekToShow,
    expanderClickHandler,
    cardClickHandler,
    className,
    newProjectAvailable,
    newTasksAvailable,
    activeSection,
    userSprintId = null
}: EventRegistryProps) {
    const meInformation = useRecoilValue(MeInformationAtom);
    const navigate = useNavigate();
    const pathParams = useParams();
    const clientId = pathParams.clientId;
    const baseCN = 'eventRegistry';
    const wrapperCN = clsx(`${baseCN}__wrapper`, className && className);
    const weeksHeaderCN = clsx(`${baseCN}__weeksHeader`);
    const weeksHeaderWeekCN = clsx(`${weeksHeaderCN}_week`);
    const addProjectButtonCN = clsx(
        `${baseCN}__addproject`,
        'controls-fontsize-l',
        'controls-fontweight-medium'
    );
    const newProjectClickHandler = () => {
        navigate(path(Routes.Creation, { eventType: EventType.Project }), {
            state: { section: activeSection, userSprintId, registryType, clientId},
        });
    };

    return (
        <div className={wrapperCN}>
            <div className={baseCN}>
                {newProjectAvailable && (
                    <Button
                        onClick={newProjectClickHandler}
                        className={addProjectButtonCN}
                        icon={Icons.plus}
                        showMode='common'
                        caption='Добавить новый проект'
                    />
                )}
                {weekToShow === null && (
                    <div className={weeksHeaderCN} aria-hidden>
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
                            return newTasksAvailable ? (
                                <AddTaskCard
                                    key={event.id || uuid()}
                                    project={event.project}
                                    section={event.sectionName}
                                    registryType={registryType}
                                />
                            ) : (
                                <div key={uuid()}></div>
                            );
                        } else {
                            return (
                                <EventCard
                                    key={event.id || uuid()}
                                    event={event}
                                    // item={event.item}
                                    // id={event.id}
                                    // sectionName={event.sectionName}
                                    // expanded={event.projectExpanded}
                                    weekToShow={weekToShow}
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
