import { useEffect, useState } from 'react';
import { Tab } from '../../Platform/_tabs/TabType';
import TabSelector from '../../Platform/_tabs/TabSelector';
import DropdownSelector, {
    DropdownItem,
} from '../../Platform/_dropdownSelector/DropdownSelector';
import TimeComparer from '../../Platform/_times/TimeComparer';

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
    {
        caption: 'Неделя 1',
        hint: '01.01–07.01',
        value: 'week1',
    },
    {
        caption: 'Неделя 2',
        hint: '08.01–14.01',
        value: 'week2',
    },
    {
        caption: 'Неделя 3',
        hint: '15.01–21.01',
        value: 'week3',
    },
    {
        caption: 'Неделя 4',
        hint: '22.01–28.01',
        value: 'week4',
    },
    {
        caption: 'Все недели',
        hint: '01.01–28.01',
        value: 'allWeeks',
    },
];

function HomeScreen() {
    const [activeTab, setActiveTab] = useState<Tab>(Tabs[0]);
    const [selectedItem, setSelectedItem] = useState<DropdownItem>(Items[0]);

    useEffect(() => {
        document.body.className = `body-color-${activeTab.value}`;
    }, [activeTab]);

    return (
        <>
            <TimeComparer
                firstTime={{
                    value: '12:34',
                }}
                secontTime={{
                    value: '12:45',
                    color: 'purple'
                }}
            />
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
        </>
    );
}

export default HomeScreen;
