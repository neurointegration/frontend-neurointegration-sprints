import DropdownSelector, {
    DropdownItem,
} from '../../../Platform/_dropdownSelector/DropdownSelector';
import {
    EventCardType,
    EventType,
    TimeInfoType,
} from '../../components/_cards/_types/EventCardType';
import EventRegistry, {
    RegistryItemType,
} from '../../components/_registry/EventRegistry';
import { MainColorStatus } from '../../../Platform/_types/Statuses';
import TabSelector from '../../../Platform/_tabs/TabSelector';
import { Tab } from '../../../Platform/_tabs/TabType';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/_sidebar/Sidebar';
import { TimeEditorValueType } from '../../../Platform/_times/TimeEditor';
import { ColorStatusType } from '../../components/_editors/TimeStatusEditor';
import EventEditorDialog from '../../components/_dialogs/EventEditorDialog';
import { EventCardClickHandlerType } from '../../components/_cards/EventCard';
import clsx from 'clsx';
import './SprintStyle.css';
import { useNavigate } from 'react-router-dom';
import { path, Routes } from '../../../core/routing/routes';

const SECTIONS_TABS: Tab[] = [
    {
        caption: 'Лайф',
        value: 'life',
    },
    {
        caption: 'Кайф',
        value: 'kaif',
    },
    {
        caption: 'Драйв',
        value: 'drive',
    },
];

const DROPDOWN_ITEMS: DropdownItem[] = [
    // {
    //     caption: 'Неделя 1',
    //     hint: '01.01–07.01',
    //     value: 'week1',
    // },
    // {
    //     caption: 'Неделя 2',
    //     hint: '08.01–14.01',
    //     value: 'week2',
    // },
    // {
    //     caption: 'Неделя 3',
    //     hint: '15.01–21.01',
    //     value: 'week3',
    // },
    // {
    //     caption: 'Неделя 4',
    //     hint: '22.01–28.01',
    //     value: 'week4',
    // },
    // {
    //     caption: 'Все недели',
    //     hint: '01.01–28.01',
    //     value: 'allWeeks',
    // },
    {
        caption: 'Отображение 3 недель',
        hint: 'а тут подсказка...',
        value: TimeInfoType.ThreeWeeks,
    },
    {
        caption: 'Отображение 1 пары',
        value: TimeInfoType.Common,
    },
    {
        caption: 'Отображение без времени',
        value: TimeInfoType.None,
    },
    {
        caption: 'Отображение 4 недель',
        value: TimeInfoType.FourWeeks,
    },
];

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
    const [activeTab, setActiveTab] = useState<Tab>(SECTIONS_TABS[0]);
    const [selectedItem, setSelectedItem] = useState<DropdownItem>(
        DROPDOWN_ITEMS[0]
    );

    useEffect(() => {
        document.body.className = `body-color-${activeTab.value}`;
    }, [activeTab]);

    const item: EventCardType = {
        title: 'Диспансериазация',
        timeValues: [
            { value: '12:34' },
            { value: '12:34', color: 'green' },
            { value: null },
            { value: null, color: 'gray' },
            { value: null },
            { value: null, color: 'gray' },
            { value: '12:34' },
            { value: '12:34', color: 'purple' },
            { value: '12:34' },
            { value: '12:34' },
        ],
        type: EventType.Project,
        color: activeTab.value as MainColorStatus,
    };

    const item2: EventCardType = {
        title: 'Задача в проекте',
        timeValues: [
            { value: '2:34' },
            { value: '12:34', color: 'yellow' },
            { value: '12:34' },
            { value: '12:34', color: 'green' },
            { value: '12:34' },
            { value: '12:34' },
            { value: '12:34' },
            { value: '12:34', color: 'purple' },
            { value: '12:34' },
            { value: '12:34' },
        ],
        type: EventType.Task,
    };

    const [items, setItems] = useState<RegistryItemType[]>([
        { item: item, id: '1', project: null, projectExpanded: false },
        {
            item: { ...item, title: 'Ещё какой-то проект' },
            id: 'abracadabra',
            project: null,
            projectExpanded: false,
        },
    ]);

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
                        item: { type: EventType.AddTasCpecial },
                        id: null,
                        project: id,
                        projectExpanded: false,
                    },
                ];

                // TODO: здесь просим новые элементы с сервера и причесываем их
                // пока сэмулируем, что нам пришли новые карточки заданий
                if (id === '1') {
                    newItems.push({
                        item: item2,
                        id: '2',
                        project: '1',
                        projectExpanded: false,
                    });
                    newItems.push({
                        item: item2,
                        id: '3',
                        project: '1',
                        projectExpanded: false,
                    });
                }

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

    const testUseTime = useState<TimeEditorValueType>({
        hours: 98,
        minutes: 17,
    });
    const test2UseTime = useState<TimeEditorValueType>({
        hours: 99,
        minutes: 1,
    });

    const useChosedColorStatus = useState<ColorStatusType>(null);

    const useTitle = useState<string | null>(
        'Очень при очень длинное название при название при очень при очень'
    );

    const [dialogProps, setDialogProps] =
        useState<DialogProps>(EmptyDialogProps);

    /**
     * Обработчик клика по карточке события (по проекту или по задаче)
     * В зависимости от выбранного отображения недели
     * открывает диалоговое окно или производит редирект на страницу редактирования события
     * @param id Идентификатор события
     * @param item Дескриптор события
     */
    const eventCardClickHandler: EventCardClickHandlerType = (id, item) => {
        if (
            selectedItem.value === TimeInfoType.FourWeeks ||
            selectedItem.value === TimeInfoType.ThreeWeeks
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
                items={DROPDOWN_ITEMS}
                useSelectedItem={[selectedItem, setSelectedItem]}
                selectedValueClassName={clsx(
                    'controls-margin_top-xl',
                    'controls-margin_bottom-4xl'
                )}
            />
            <TabSelector
                tabs={SECTIONS_TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <EventRegistry
                items={items}
                timeType={selectedItem.value}
                expanderClickHandler={expanderClickHandler}
                cardClickHandler={eventCardClickHandler}
                className='controls-margin_bottom-3xl'
                newProjectAvailable
            />
        </>
    );
}

export default Sprint;
