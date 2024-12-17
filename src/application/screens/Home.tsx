import { useEffect, useState } from 'react';
import { Tab } from '../../Platform/_tabs/TabType';
import TabSelector from '../../Platform/_tabs/TabSelector';
import DropdownSelector, {
    DropdownItem,
} from '../../Platform/_dropdownSelector/DropdownSelector';
import {
    EventCardType,
    EventType,
} from '../components/_cards/_types/EventCardType';
import EventCard from '../components/_cards/EventCard';
import { MainColorStatus } from '../../Platform/_types/Statuses';

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
        caption: 'Отоюражение без времени',
        value: 0,
    },
    {
        caption: 'Отображение 4 недель',
        value: 5,
    },
];

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
        title: 'Проект веб',
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

    return (
        <>
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
            <EventCard item={item} timeType={selectedItem.value} />
            <EventCard item={item2} timeType={selectedItem.value} />
        </>
    );
}

export default HomeScreen;
