import clsx from 'clsx';
import { SectionType } from './TabType';

type TabButtonProps = {
    tab: SectionType;
    selected: boolean;
    onClick: (value: SectionType) => void;
};

function TabButton({ tab, selected, onClick }: TabButtonProps) {
    const buttonCN = clsx(
        'controls-tabSelector__button',
        selected && 'controls-tabSelector__button_selected'
    );

    return (
        <button className={buttonCN} onClick={() => onClick(tab)}>
            {tab.caption}
        </button>
    );
}

export default TabButton;
