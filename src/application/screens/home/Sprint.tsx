import DropdownSelector, {
    DropdownItem,
} from '../../../Platform/_dropdownSelector/DropdownSelector';
import {
    EventCardType,
    EventType,
} from '../../components/_cards/_types/EventCardType';
import EventRegistry, {
    RegistryItemType,
} from '../../components/_registry/EventRegistry';
import TabSelector from '../../../Platform/_tabs/TabSelector';
import { SectionType } from '../../../Platform/_tabs/TabType';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/_sidebar/Sidebar';
import EventEditorDialog from '../../components/_dialogs/EventEditorDialog';
import { EventCardClickHandlerType } from '../../components/_cards/EventCard';
import clsx from 'clsx';
import './SprintStyle.css';
import { useNavigate } from 'react-router-dom';
import { path, Routes } from '../../../core/routing/routes';
import CurrentSprintAtom from '../../../core/atoms/sprint.atom';
import cutDate from '../../../core/api/utils/dateCutter';
import { useRecoilValue } from 'recoil';
import { API } from '../../../core/api/handles';
import { PossibleDatesResponseKeysType } from '../../../core/api/actions/sprints';
import {
    CurrentSprintDropdownValue,
    DROPDOWN_DATES_SEPARATOR,
    SECTIONS,
} from './constants';

type DialogProps = {
    opened: boolean;
    eventId: string;
    item: EventCardType | null;
};

const EmptyDialogProps: DialogProps = {
    opened: false,
    eventId: null,
    item: null,
};

export type ExpanderClickHandlerType = (id: string, expanded: boolean) => void;

function Sprint() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SectionType>(SECTIONS[0]);
    const [selectedDropdownItem, setSelectedDropdownItem] =
        useState<DropdownItem<keyof typeof CurrentSprintDropdownValue> | null>(
            null
        );
    const [dialogProps, setDialogProps] =
        useState<DialogProps>(EmptyDialogProps);
    const [dropdownItems, setdropdownItems] = useState<
        DropdownItem<keyof typeof CurrentSprintDropdownValue>[]
    >([]);
    const [items, setItems] = useState<RegistryItemType[]>([]);

    const currentSprint = useRecoilValue(CurrentSprintAtom);

    // ========= USE EFFECTS ===========
    useEffect(() => {
        const weeks = currentSprint.weeks;
        const newItems = [];

        Object.keys(weeks).map((key: PossibleDatesResponseKeysType) => {
            const begin = weeks[key].begin;
            const end = weeks[key].end;
            newItems.push({
                caption: `Неделя ${key}`,
                hint: cutDate(begin) + DROPDOWN_DATES_SEPARATOR + cutDate(end),
                value: CurrentSprintDropdownValue[`week${key}`],
            });
        });

        newItems.push({
            caption: 'Все недели',
            hint:
                cutDate(currentSprint.beginDate) +
                DROPDOWN_DATES_SEPARATOR +
                cutDate(currentSprint.endDate),
            value: 'allWeeks',
        });

        setdropdownItems(() => [...newItems]);
        setSelectedDropdownItem(() => newItems[newItems.length - 1]);
    }, [currentSprint]);

    useEffect(() => {
        document.body.className = `body-color-${activeTab.value}`;
    }, [activeTab]);

    useEffect(() => {
        if (currentSprint.id) {
            API.PROJECTS.Projects(currentSprint.id).then((res) => {
                if (res.isSuccess) {
                    const newItems: RegistryItemType[] = [];

                    res.body.map((resProj) => {
                        const item: EventCardType = {
                            title: resProj.title,
                            timeValues: {
                                planningTimes: resProj.planningTimes,
                                factTimes: resProj.factTimes,
                            },
                            type: EventType.Project,
                            section: resProj.sectionName,
                        };

                        newItems.push({
                            item,
                            id: resProj.id,
                            project: null,
                            projectExpanded: false,
                        });
                    });

                    setItems(() => [...newItems]);
                }
            });
        }
    }, [currentSprint]);

    // { item: item, id: '1', project: null, projectExpanded: false },
    //     {
    //         item: { ...item, title: 'Ещё какой-то проект' },
    //         id: 'abracadabra',
    //         project: null,
    //         projectExpanded: false,
    //     }

    // useLayoutEffect(() => {
    //     API.SPRINTS.GetAllSprints().then((resp) => {
    //         if (resp.isSuccess) {
    //             console.log('МЫ ПОЛУЧИЛИ ЧТО-ТО!');
    //             const test = resp.body[0];
    //             console.log(test);
    //         } else {
    //             console.log('мы ничего не получили(');
    //         }
    //     });
    // }, []);

    // =================================

    // const item: EventCardType = {
    //     title: 'Диспансериазация',
    //     timeValues: [
    //         { value: '12:34' },
    //         { value: '12:34', color: 'green' },
    //         { value: null },
    //         { value: null, color: 'gray' },
    //         { value: null },
    //         { value: null, color: 'gray' },
    //         { value: '12:34' },
    //         { value: '12:34', color: 'purple' },
    //         { value: '12:34' },
    //         { value: '12:34' },
    //     ],
    //     type: EventType.Project,
    //     color: activeTab.value as MainSectionType,
    // };

    // const item2: EventCardType = {
    //     title: 'Задача в проекте',
    //     timeValues: [
    //         { value: '2:34' },
    //         { value: '12:34', color: 'yellow' },
    //         { value: '12:34' },
    //         { value: '12:34', color: 'green' },
    //         { value: '12:34' },
    //         { value: '12:34' },
    //         { value: '12:34' },
    //         { value: '12:34', color: 'purple' },
    //         { value: '12:34' },
    //         { value: '12:34' },
    //     ],
    //     type: EventType.Task,
    // };

    // const [items, setItems] = useState<RegistryItemType[]>([
    //     { item: item, id: '1', project: null, projectExpanded: false },
    //     {
    //         item: { ...item, title: 'Ещё какой-то проект' },
    //         id: 'abracadabra',
    //         project: null,
    //         projectExpanded: false,
    //     },
    // ]);

    /*
        Обработчик клика по экспандеру на карточке проекта
        делает запрос на сервер за задачами из проекта по uuid проекта

        Затем изменяет основной массив items, добавляя новые значение и устанавливая
        projectExpanded на true
    */

    const expanderClickHandler: ExpanderClickHandlerType = (id, expanded) => {
        setItems((prevItems) => {
            const index = prevItems.findIndex((item) => item.id === id);
            if (index === -1) {
                return;
            }

            let result;
            if (expanded) {
                result = prevItems.filter((item) => item.project !== id);
                result[index] = { ...prevItems[index], projectExpanded: false };
            } else {
                // ОБЯЗАТЕЛЬНО! Добавляем карточку "Добавить задачу"
                const newItems: RegistryItemType[] = [
                    {
                        item: { type: EventType.AddTaskSpecial },
                        id: null,
                        project: id,
                        projectExpanded: false,
                    },
                ];

                // TODO: здесь просим новые элементы с сервера и причесываем их
                // пока сэмулируем, что нам пришли новые карточки заданий
                // if (id === '1') {
                //     newItems.push({
                //         item: item2,
                //         id: '2',
                //         project: '1',
                //         projectExpanded: false,
                //     });
                //     newItems.push({
                //         item: item2,
                //         id: '3',
                //         project: '1',
                //         projectExpanded: false,
                //     });
                // }

                result = [
                    ...prevItems.slice(0, index),
                    { ...prevItems[index], projectExpanded: true },
                    ...newItems,
                    ...prevItems.slice(index + 1),
                ];
            }

            return result;
        });
    };

    /**
     * Обработчик клика по карточке события (по проекту или по задаче)
     * В зависимости от выбранного отображения недели
     * открывает диалоговое окно или производит редирект на страницу редактирования события
     * @param id Идентификатор события
     * @param item Дескриптор события
     */
    const eventCardClickHandler: EventCardClickHandlerType = (id, item) => {
        if (
            selectedDropdownItem.value === CurrentSprintDropdownValue.allWeeks
        ) {
            navigate(path(Routes.Editing, { eventType: item.type, id }), {
                state: { item },
            });
        } else {
            setDialogProps(() => ({
                opened: true,
                eventId: id,
                item,
            }));
        }
    };

    return (
        <>
            {dialogProps.opened && (
                <EventEditorDialog
                    eventId={dialogProps.eventId}
                    item={dialogProps.item}
                    onClose={() => setDialogProps(() => EmptyDialogProps)}
                />
            )}
            <Sidebar
                menuButtonClassName={clsx(
                    'controls-margin_top-s',
                    'controls-margin_left-xl'
                )}
            />
            <DropdownSelector
                items={dropdownItems}
                useSelectedItem={[
                    selectedDropdownItem,
                    setSelectedDropdownItem,
                ]}
                selectedValueClassName={clsx(
                    'controls-margin_top-xl',
                    'controls-margin_bottom-4xl'
                )}
            />
            <TabSelector
                tabs={SECTIONS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <EventRegistry
                items={items}
                chosedPeriod={
                    selectedDropdownItem
                        ? selectedDropdownItem?.value
                        : 'allWeeks'
                }
                expanderClickHandler={expanderClickHandler}
                cardClickHandler={eventCardClickHandler}
                className={clsx('controls-margin_bottom-3xl')}
                newProjectAvailable
            />
        </>
    );
}

export default Sprint;
