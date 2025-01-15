import clsx from 'clsx';
import TabButton from './TabButton';
import { SectionType } from './TabType';
import './TabsStyle.css';
import React, { useCallback } from 'react';

type TabSelectorProps = {
    tabs: SectionType[];
    activeTab: SectionType;
    setActiveTab: React.Dispatch<React.SetStateAction<SectionType>>;
};

function TabSelector({ tabs, activeTab, setActiveTab }: TabSelectorProps) {
    const tabClickHandler = useCallback((tab: SectionType) => {
        setActiveTab(() => tab);
    }, []);

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

export default React.memo(TabSelector);
