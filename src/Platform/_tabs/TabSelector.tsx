import clsx from 'clsx';
import TabButton from './TabButton';
import { SectionType } from './TabType';
import './TabsStyle.css';
import React, { useCallback } from 'react';
import { SetterOrUpdater } from 'recoil';

type TabSelectorProps = {
    tabs: SectionType[];
    activeTab: SectionType;
    setActiveTab: SetterOrUpdater<{
        selectedSectionTab: SectionType;
    }>;
};

function TabSelector({ tabs, activeTab, setActiveTab }: TabSelectorProps) {
    const tabClickHandler = useCallback((tab: SectionType) => {
        setActiveTab(() => ({ selectedSectionTab: tab }));
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
