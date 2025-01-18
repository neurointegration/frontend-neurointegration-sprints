import clsx from 'clsx';
import TabButton from './TabButton';
import { SectionType } from './TabType';
import './TabsStyle.css';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import ScreensSectionsAtom from '../../core/atoms/screensSections.atom';
import { BaseRegistryType } from '../../application/screens/home/constants';

type TabSelectorProps = {
    tabs: SectionType[];
    registryType: BaseRegistryType;
};

function SectionSelector({ tabs, registryType }: TabSelectorProps) {
    const [selectedScreensSections, setSelectedScreensSections] =
        useRecoilState(ScreensSectionsAtom);

    const tabClickHandler = useCallback((tab: SectionType) => {
        setSelectedScreensSections((prev) => ({
            ...prev,
            [registryType]: tab,
        }));
    }, []);

    const tabSelectorCN = clsx('controls-tabSelector');

    return (
        <div className={tabSelectorCN}>
            {tabs.map((section) => (
                <TabButton
                    key={section.value}
                    tab={section}
                    selected={
                        selectedScreensSections[registryType].value ===
                        section.value
                    }
                    onClick={tabClickHandler}
                />
            ))}
        </div>
    );
}

export default React.memo(SectionSelector);
