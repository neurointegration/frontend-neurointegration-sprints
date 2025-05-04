import clsx from 'clsx';
import Sidebar from '../../components/_sidebar/Sidebar';
import './StandupStyle.css';
import StandupCard from '../../components/_cards/StandupCard';


import { useRecoilState, useRecoilValue } from 'recoil';
import { API } from '../../../core/api/handles';
import { DROPDOWN_DATES_SEPARATOR } from '../home/constants';
import StandupSprintsAtom from '../../../core/atoms/standup.atom';
import { useState, useEffect } from 'react';
import DropdownSelector, { DropdownItem } from '../../../Platform/_dropdownSelector/DropdownSelector';
import { formatDate } from '../../../core/api/utils/dateCutter';
import { StandupDropdownSelectedAtom } from '../../../core/atoms/screensDropdown.atom';
import { StandupResponseType } from '../../../core/api/actions/standup';
import { transformStandups } from '../../../core/api/utils/standupAnswersTransformer';


const StandupScreen = () => {

    const standup = useRecoilValue(StandupSprintsAtom);

    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        StandupDropdownSelectedAtom
    );

    const [dropdownItems, setdropdownItems] = useState<DropdownItem<string>[]>(
        []
    );

    const [standupsPromise, setStandupsPromise] = useState(null);

    const [items, setItems] = useState<StandupResponseType[]>();


    //========= USE EFFECTS ===========
    useEffect(() => {
        const newItems: DropdownItem<string>[] = [];

        standup.map((sprint) => {
            const begin = sprint.beginDate;
            const end = sprint.endDate;
            const caption =
                begin && end
                    ? `${formatDate(
                          begin
                      )}${DROPDOWN_DATES_SEPARATOR}${formatDate(end)}`
                    : 'Срок неопределён';

            newItems.push({
                caption: caption,
                value: sprint.id,
            });
        });

        setdropdownItems(() => [...newItems]);
        setSelectedDropdownItem((prev) => {
            const values = newItems.filter((item) => item.value === prev?.value);

            return values.length ? prev : newItems[newItems.length - 1];
        });
    }, [standup]);

    useEffect(() => {
        if (selectedDropdownItem?.value || selectedDropdownItem?.value == '0') {
            setStandupsPromise(() =>
                API.STANDUP.GetStandup(selectedDropdownItem.value)
            );
        }
    }, [selectedDropdownItem]);


    useEffect(() => {
        standupsPromise?.then((res) => {
            const newItems: StandupResponseType[] = [];
            if (res.isSuccess) {
                res.body.map((resProj) => {
                    const item: StandupResponseType = {
                        answerType: resProj.answerType,
                        sprintNumber: resProj.sprintNumber,
                        date: resProj.date,
                        answer: resProj.answer
                    };
                    newItems.push(item);
                    }
                );
            }
            setItems(() => (newItems));
        });
    }, [standupsPromise]);


    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    return (
        <div className='standup-container'>
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
            { transformStandups(items) ? items.length > 0 ? transformStandups(items).map((item) => <StandupCard 
                date={item.date}
                mentalStates={item.mentalStates}
                wins={item.wins}
                focusLife={item.focusLife}
                focusFun={item.focusFun}
                focusDrive={item.focusDrive} 
                sprintNumber={item.sprintNumber}/>) : <h3>Кажется, в выбранный спринт нет ни одного стендапа...</h3> : <h3>Кажется, в выбранный спринт нет ни одного стендапа...</h3>}
        </div>
    );
};

export default StandupScreen;


















/*



import {
    BaseRegistryType,
    SprintWeekDropdownValueType,
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
import { EventCardClickHandlerType } from '../../components/_cards/EventCard';
import EventEditorDialog from '../../components/_dialogs/EventEditorDialog';
import { MainSectionType } from '../../../Platform/_types/Statuses';
import SectionSelector from '../../../Platform/_tabs/TabSelector';
import { path, Routes } from '../../../core/routing/routes';
import Sidebar from '../../components/_sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import './SprintStyle.css';
import clsx from 'clsx';
import {
    PossibleTimeResponceKeysType,
    ProjectResponseType,
} from '../../../core/api/actions/projects';
import ScreensSectionsAtom from '../../../core/atoms/screensSections.atom';
import {
    HTTPErrorResponse,
    HTTPSuccessResponse,
} from '../../../core/api/utils/httpHandlers';
import { TaskResponse } from '../../../core/api/actions/tasks';

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

/**
 * Типы реестров событий, в которых поддерживается отображение выпадающего списка с выбором режима.
 * Подразумевает, что useDropdownItems соответствует типу
 * UseSelectedDropdownItem<CurrentSprintDropdownValue>.
 *
 * В других реестрах будут отображаться все пары времен
 
const TYPES_TO_SHOW_WEEKS = [
    BaseRegistryType.ClientSprint,
    BaseRegistryType.MainSprint,
];

type UseSelectedDropdownItem<T extends string | number> = [
    DropdownItem<T>[],
    DropdownItem<T>,
    React.Dispatch<React.SetStateAction<DropdownItem<T>>>
];

type MainItemsType = {
    Life: RegistryItemType[];
    Fun: RegistryItemType[];
    Drive: RegistryItemType[];
};

export type BaseRegistryProps<T extends string | number> = {
    /**
     * Настройки создания и редактирования.
     * Возведение флага позволяет как создавать, так и редактировать вид сущности
     
    editingSettings: {
        editProjects: boolean;
        editTasks: boolean;

        /**
         * Могут ли карточки событий редактироваться в редиме диалогового окна.
         * Возведение флага предполагает, что registryType содержится в TYPES_TO_SHOW_WEEKS
         
        editInDialogMode: boolean;
    };

    /**
     * Тип базового реестра.
     * Поддерживаются типы: 'mainSprint', 'history', 'clientSprint';
     
    registryType: BaseRegistryType;
    userSprintId?: string;

    /**
     * Управление состоянием выбранного элемента выпадающего списка.
     * Первым элементом ожидает массив выпадающих элементов,
     * вторым и третьим - стейт и сеттер выбранного элемента
     
    useDropdownItems: UseSelectedDropdownItem<T>;

    /**
     * Результат этого промиса должен содержать запрос проектов для отображения в реестре
     
    projectsSourceMethodPromise: Promise<
        HTTPSuccessResponse<ProjectResponseType[]> | HTTPErrorResponse
    >;

    /**
     * Коллбэк должен возвращать промис, в результате которого будут получены задачи для projectId
     
    tasksByProjectCallback: (
        projectId: string
    ) => Promise<HTTPSuccessResponse<TaskResponse[]> | HTTPErrorResponse>;
};

function BaseRegistry<T extends string | number>({
    editingSettings,
    registryType,
    userSprintId,
    useDropdownItems: [
        dropdownItems,
        selectedDropdownItem,
        setSelectedDropdownItem,
    ],
    projectsSourceMethodPromise,
    tasksByProjectCallback,
}: BaseRegistryProps<T>) {
    const navigate = useNavigate();
    const [dialogProps, setDialogProps] =
        useState<DialogProps>(EmptyDialogProps);

    const [items, setItems] = useState<MainItemsType>({
        Life: [],
        Drive: [],
        Fun: [],
    });

    // const currentSprint = useRecoilValue(CurrentSprintAtom);
    // const meInformation = useRecoilValue(MeInformationAtom);

    const selectedScreensSections = useRecoilValue(ScreensSectionsAtom);
    // const test = useState<DropdownItem<
    //     keyof typeof CurrentSprintDropdownValue
    // > | null>(null);
    // const [dropdownItems, setdropdownItems] = useState<
    //     DropdownItem<keyof typeof CurrentSprintDropdownValue>[]
    // >([]);
    // const [items, setItems] = useState<MainItemsType>({
    //     Life: [],
    //     Drive: [],
    //     Fun: [],
    // });

    // // ========= USE EFFECTS ===========
    // useEffect(() => {
    //     const weeks = currentSprint.weeks;
    //     const newItems = [];

    //     Object.keys(weeks).map((key: PossibleDatesResponseKeysType, index) => {
    //         const begin = weeks[key].begin;
    //         const end = weeks[key].end;
    //         if (index < (meInformation.sprintWeeksCount || 4))
    //             newItems.push({
    //                 caption: `Неделя ${key}`,
    //                 hint:
    //                     cutDate(begin) +
    //                     DROPDOWN_DATES_SEPARATOR +
    //                     cutDate(end),
    //                 value: CurrentSprintDropdownValue[`week${key}`],
    //             });
    //     });

    //     newItems.push({
    //         caption: 'Все недели',
    //         hint:
    //             cutDate(currentSprint.beginDate) +
    //             DROPDOWN_DATES_SEPARATOR +
    //             cutDate(currentSprint.endDate),
    //         value: 'allWeeks',
    //     });

    //     setdropdownItems(() => [...newItems]);
    //     setSelectedDropdownItem(() => newItems[newItems.length - 1]);
    // }, [meInformation, currentSprint]);

    useEffect(() => {
        document.body.className = `body-color-${selectedScreensSections[registryType].value}`;
    }, [selectedScreensSections]);

    /**
     * Хук обрабатывает результат запроса получение проектов для отображения карточек
     
    useEffect(() => {
        projectsSourceMethodPromise?.then((res) => {
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
                        ['Life', 'Fun', 'Drive'].includes(resProj.sectionName)
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
    }, [projectsSourceMethodPromise]);

    /**
     * Обработчик клика по экспандеру на карточке проекта.
     *
     * Делает запрос на сервер за задачами из проекта по его projectId.
     * Затем изменяет основной массив items, добавляя новые значение и устанавливая
     * projectExpanded у айтема проекта в true
     *
     * @param projectId Идентификатор проекта, у которого кликнули по экспандеру
     * @param expanded Текущее состояние карточки проекта. Развернута ли
     
    const expanderClickHandler: ExpanderClickHandlerType = (
        projectId,
        expanded,
        sectionName
    ) => {
        /*
            Если проект развернут, зачистим items удалив карточки задач этого проекта,
            т.к. при нажатии на экспандер открытого проекта мы его закрываем
            Делать запрос к API в таком случае не нужно.
        
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

        const apiPromise = tasksByProjectCallback(projectId);

        apiPromise.then((res) => {
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
     
    const eventCardClickHandler: EventCardClickHandlerType = (
        eventDescriptor
    ) => {
        if (
            editingSettings.editInDialogMode &&
            (selectedDropdownItem?.value as SprintWeekDropdownValueType) !==
                null
        ) {
            const dropdownValue =
                (selectedDropdownItem?.value as SprintWeekDropdownValueType) ||
                null;
            const timeKey: PossibleTimeResponceKeysType =
                dropdownValue === null ? `total` : `${dropdownValue}`;

            setDialogProps(() => ({
                opened: true,
                itemDescriptor: eventDescriptor,
                timeKey,
            }));
        } else {
            navigate(
                path(
                    !editingSettings.editProjects || !editingSettings.editTasks
                        ? Routes.Readonly
                        : Routes.Editing,
                    {
                        eventType: eventDescriptor.item.type,
                        id: eventDescriptor.id,
                    }
                ),
                {
                    state: { eventDescriptor, registryType, userSprintId },
                }
            );
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
            <SectionSelector tabs={SECTIONS} registryType={registryType} />
            <EventRegistry
                items={items[selectedScreensSections[registryType].value]}
                weekToShow={
                    TYPES_TO_SHOW_WEEKS.includes(registryType)
                        ? (selectedDropdownItem?.value as SprintWeekDropdownValueType)
                        : null
                }
                expanderClickHandler={expanderClickHandler}
                cardClickHandler={eventCardClickHandler}
                activeSection={selectedScreensSections[registryType].value}
                className={clsx('controls-margin_bottom-3xl')}
                newProjectAvailable={editingSettings.editProjects}
                newTasksAvailable={editingSettings.editTasks}
                userSprintId={userSprintId}
            />
        </>
    );
}

export default BaseRegistry;


*/