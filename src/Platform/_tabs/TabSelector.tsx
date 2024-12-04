import clsx from 'clsx';
import TabButton from './TabButton';
import { Tab } from './TabType';
import './TabsStyle.css';

type TabSelectorProps = {
    tabs: Tab[];
    activeTab: Tab;
    setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
};

function TabSelector({ tabs, activeTab, setActiveTab }: TabSelectorProps) {
    const tabClickHandler = (tab: Tab) => {
        setActiveTab(() => tab);
    };

    const tabSelectorCN = clsx('controls-tabSelector');

    return (
        <div className={tabSelectorCN}>
            {tabs.map((tab) => (
                <TabButton
                    key={tab.value}
                    tab={tab}
                    selected={activeTab.value === tab.value}
                    onClick={tabClickHandler}
                />
            ))}
        </div>
    );
}

export default TabSelector;
