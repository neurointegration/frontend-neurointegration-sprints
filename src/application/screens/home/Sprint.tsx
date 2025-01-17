import {
    CurrentSprintDropdownValue,
    DROPDOWN_DATES_SEPARATOR,
    SECTIONS,
} from './constants';
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
import { PossibleDatesResponseKeysType } from '../../../core/api/actions/sprints';
import { EventCardClickHandlerType } from '../../components/_cards/EventCard';
import EventEditorDialog from '../../components/_dialogs/EventEditorDialog';
import { MainSectionType } from '../../../Platform/_types/Statuses';
import CurrentSprintAtom from '../../../core/atoms/sprint.atom';
import TabSelector from '../../../Platform/_tabs/TabSelector';
import { SectionType } from '../../../Platform/_tabs/TabType';
import { path, Routes } from '../../../core/routing/routes';
import cutDate from '../../../core/api/utils/dateCutter';
import Sidebar from '../../components/_sidebar/Sidebar';
import { API } from '../../../core/api/handles';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import './SprintStyle.css';
import clsx from 'clsx';
import { PossibleTimeResponceKeysType } from '../../../core/api/actions/projects';
import MainSectionAtom from '../../../core/atoms/mainSection.atom';

type DialogProps = {
    opened: boolean;
    itemDescriptor: RegistryItemType | null;
    timeKey: PossibleTimeResponceKeysType;
};

const EmptyDialogProps: DialogProps = {
    opened: false,
    itemDescriptor: null,
    timeKey: 'total',
};

export type ExpanderClickHandlerType = (
    id: string,
    expanded: boolean,
    sectionName: MainSectionType
) => void;

type MainItemsType = {
    Life: RegistryItemType[];
    Fun: RegistryItemType[];
    Drive: RegistryItemType[];
};

const dropDownMapper = {
    week1: '1',
    week2: '2',
    week3: '3',
    week4: '4',
    allWeeks: 'total',
};

function Sprint() {
    const navigate = useNavigate();
    const [{ selectedSectionTab }, setActiveTab] = useRecoilState(MainSectionAtom);
    const [selectedDropdownItem, setSelectedDropdownItem] =
        useState<DropdownItem<keyof typeof CurrentSprintDropdownValue> | null>(
            null
        );
    const [dialogProps, setDialogProps] =
        useState<DialogProps>(EmptyDialogProps);
    const [dropdownItems, setdropdownItems] = useState<
        DropdownItem<keyof typeof CurrentSprintDropdownValue>[]
    >([]);
    const [items, setItems] = useState<MainItemsType>({
        Life: [],
        Drive: [],
        Fun: [],
    });

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
        document.body.className = `body-color-${selectedSectionTab.value}`;
    }, [selectedSectionTab]);

    useEffect(() => {
        if (currentSprint.id) {
            API.PROJECTS.Projects(currentSprint.id).then((res) => {
                if (res.isSuccess) {
                    const newItemsByTabs: MainItemsType = {
                        Life: [],
                        Fun: [],
                        Drive: [],
                    };

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

                        if (
                            ['Life', 'Fun', 'Drive'].includes(
                                resProj.sectionName
                            )
                        ) {
                            newItemsByTabs[resProj.sectionName].push({
                                item,
                                id: resProj.id,
                                project: null,
                                projectExpanded: false,
                                sectionName: resProj.sectionName,
                            });
                        }
                    });

                    setItems(() => ({ ...newItemsByTabs }));
                }
            });
        }
    }, [currentSprint]);

    /**
     * Обработчик клика по экспандеру на карточке проекта.
     *
     * Делает запрос на сервер за задачами из проекта по его projectId.
     * Затем изменяет основной массив items, добавляя новые значение и устанавливая
     * projectExpanded у айтема проекта в true
     *
     * @param projectId Идентификатор проекта, у которого кликнули по экспандеру
     * @param expanded Текущее состояние карточки проекта. Развернута ли
     */
    const expanderClickHandler: ExpanderClickHandlerType = (
        projectId,
        expanded,
        sectionName
    ) => {
        /*
            Если проект развернут, зачистим items удалив карточки задач этого проекта,
            т.к. при нажатии на экспандер открытого проекта мы его закрываем
            Делать запрос к API в таком случае не нужно.
        */
        if (expanded) {
            setItems((prevItemsDescriptor) => {
                const oldItems = prevItemsDescriptor[sectionName];

                const index = oldItems.findIndex(
                    (item) => item.id === projectId
                );

                if (index === -1) {
                    return;
                }

                const result = oldItems.filter(
                    (item) => item.project !== projectId
                );

                result[index] = {
                    ...oldItems[index],
                    projectExpanded: false,
                };

                return { ...prevItemsDescriptor, [sectionName]: [...result] };
            });

            // выход из обработчика для игнорирования последующего кода
            return;
        }

        API.TASKS.Tasks(projectId).then((res) => {
            if (res.isSuccess) {
                const respItems = res.body;
                // если запрос успешен, добавим задачи в items в нужную позицию
                setItems((prevItemsDescriptor) => {
                    const oldItems = prevItemsDescriptor[sectionName];

                    const index = oldItems.findIndex(
                        (item) => item.id === projectId
                    );

                    if (index === -1) {
                        return;
                    }

                    // ОБЯЗАТЕЛЬНО! Добавляем карточку "Добавить задачу"
                    const newItems: RegistryItemType[] = [
                        {
                            item: { type: EventType.AddTaskSpecial },
                            id: null,
                            project: projectId,
                            projectExpanded: false,
                            sectionName,
                        },
                    ];

                    // Затем проходимся по полученным элементам и причесываем их
                    respItems?.map((respItem) => {
                        const item: EventCardType = {
                            type: EventType.Task,
                            title: respItem.title,
                            timeValues: {
                                planningTimes: respItem.planningTimes,
                                factTimes: respItem.factTimes,
                            },
                        };
                        newItems.push({
                            item,
                            id: respItem.id,
                            project: projectId,
                            projectExpanded: false,
                            sectionName,
                        });
                    });

                    // формируем новый массив items
                    const result = [
                        ...oldItems.slice(0, index),
                        {
                            ...oldItems[index],
                            projectExpanded: true,
                        },
                        ...newItems,
                        ...oldItems.slice(index + 1),
                    ];

                    return {
                        ...prevItemsDescriptor,
                        [sectionName]: [...result],
                    };
                });
            }
        });
    };

    /**
     * Обработчик клика по карточке события (по проекту или по задаче)
     * В зависимости от выбранного отображения недели
     * открывает диалоговое окно или производит редирект на страницу редактирования события
     * @param id Идентификатор события
     * @param item Дескриптор события
     */
    const eventCardClickHandler: EventCardClickHandlerType = (
        eventDescriptor
    ) => {
        if (
            selectedDropdownItem.value === CurrentSprintDropdownValue.allWeeks
        ) {
            navigate(
                path(Routes.Editing, {
                    eventType: eventDescriptor.item.type,
                    id: eventDescriptor.id,
                }),
                {
                    state: { eventDescriptor },
                }
            );
        } else {
            setDialogProps(() => ({
                opened: true,
                itemDescriptor: eventDescriptor,
                timeKey: dropDownMapper[
                    selectedDropdownItem.value
                ] as PossibleTimeResponceKeysType,
            }));
        }
    };

    return (
        <>
            {dialogProps.opened && (
                <EventEditorDialog
                    itemDescriptor={dialogProps.itemDescriptor}
                    timeKey={dialogProps.timeKey}
                    onClose={() => setDialogProps(() => EmptyDialogProps)}
                />
            )}
            <Sidebar
                menuButtonClassName={clsx(
                    'controls-margin_top-s',
                    'controls-margin_left-3xl'
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
                activeTab={selectedSectionTab}
                setActiveTab={setActiveTab}
            />
            <EventRegistry
                items={items[selectedSectionTab.value]}
                chosedPeriod={
                    selectedDropdownItem
                        ? selectedDropdownItem?.value
                        : 'allWeeks'
                }
                expanderClickHandler={expanderClickHandler}
                cardClickHandler={eventCardClickHandler}
                className={clsx('controls-margin_bottom-3xl')}
                activeSection={selectedSectionTab.value}
                newProjectAvailable
            />
        </>
    );
}

export default Sprint;
