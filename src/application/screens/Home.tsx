import DropdownSelector, {
    DropdownItem,
} from '../../Platform/_dropdownSelector/DropdownSelector';
import {
    EventCardType,
    EventType,
} from '../components/_cards/_types/EventCardType';
import EventRegistry, { RegistryItemType } from '../components/_registry/EventRegistry';
import { MainColorStatus } from '../../Platform/_types/Statuses';
import TabSelector from '../../Platform/_tabs/TabSelector';
import { Tab } from '../../Platform/_tabs/TabType';
import { useEffect, useState } from 'react';
import Sidebar from '../components/_sidebar/Sidebar';
import TimeEditor, { TimeEditorValueType } from '../../Platform/_times/TimeEditor';
import EditorUnit from '../components/_editors/EditorUnit';

const Tabs: Tab[] = [
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

const Items: DropdownItem[] = [
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
        value: 4,
    },
    {
        caption: 'Отображение 1 пары',
        value: 1,
    },
    {
        caption: 'Отображение без времени',
        value: 0,
    },
    {
        caption: 'Отображение 4 недель',
        value: 5,
    },
];

export type ExpanderClickHandlerType = (id: string, expanded: boolean) => void;

function HomeScreen() {
    const [activeTab, setActiveTab] = useState<Tab>(Tabs[0]);
    const [selectedItem, setSelectedItem] = useState<DropdownItem>(Items[0]);

    useEffect(() => {
        document.body.className = `body-color-${activeTab.value}`;
    }, [activeTab]);

    const item: EventCardType = {
        title: 'Диспансериазация',
        timeValues: [
            { value: '12:34' },
            { value: '12:34', color: 'green' },
            { value: '12:34' },
            { value: '', color: 'gray' },
            { value: '12:34' },
            { value: '12:34' },
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
            { value: '12:34' },
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
        { item: { ...item, title: 'Ещё какой-то проект' }, id: 'abracadabra', project: null, projectExpanded: false },
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
                // TODO: здесь просим новые элементы с сервера и причесываем их
                // пока сэмулируем, что нам пришли новые карточки заданий
                const newItems = id === '1' ? [
                    { item: item2, id: '2', project: '1', projectExpanded: false },
                    { item: item2, id: '3', project: '1', projectExpanded: false },
                ] : [];
                result = [
                    ...prevItems.slice(0, index),
                    { ...prevItems[index], projectExpanded: true },
                    ...newItems,
                    ...prevItems.slice(index + 1)
                ]
            }

            return result;
        })
    };

    const testUseTime = useState<TimeEditorValueType>({ hours: 98, minutes: 17 });
    const test2UseTime = useState<TimeEditorValueType>({ hours: 99, minutes: 1 });

    return (
        <>
            <Sidebar />
            <DropdownSelector
                items={Items}
                useSelectedItem={[selectedItem, setSelectedItem]}
                selectedValueClassName='controls-margin_top-xl
                controls-margin_bottom-4xl'
            />
            <TabSelector
                tabs={Tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <EventRegistry
                expanderClickHandler={expanderClickHandler}
                items={items}
                timeType={selectedItem.value}
            />
            <EditorUnit usePlannedTime={testUseTime} useFactTime={test2UseTime}/>
        </>
    );
}

export default HomeScreen;
