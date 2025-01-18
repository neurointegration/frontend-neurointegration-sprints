import clsx from 'clsx';
import './TimeStatusEditorStyle.css';
import { EventType } from '../_cards/_types/EventCardType';
import { Icons } from '../../../Platform/_types/Icons';
import { TimeStatusType } from '../../../Platform/_times/TimeComparer';

export type ColorStatusType = 'yellow' | 'green' | 'purple' | null;
export type UseTimeStatusType = [
    ColorStatusType,
    React.Dispatch<React.SetStateAction<ColorStatusType>>
];

const ITEMS: {
    title: string;
    value: TimeStatusType;
    addVariative: boolean;
}[] = [
    { title: 'Отказаться от', value: 'Decline', addVariative: true },
    { title: 'Продолжить так же', value: 'Continue', addVariative: false },
    { title: 'Скорректировать план', value: 'Modify', addVariative: false },
];

type TimeStatusEditorProps = {
    value: TimeStatusType;
    eventType: EventType;
    onChangeCallback: (newStatus: TimeStatusType) => void;
    disabled?: boolean;
};

function TimeStatusEditor({
    value,
    eventType,
    onChangeCallback,
    disabled,
}: TimeStatusEditorProps) {
    const baseCN = 'timeStatusEditor';
    const statusItemCN = clsx(`${baseCN}__statusItem`);
    const statusPickerButtonCN = clsx(`${baseCN}__pickerButton`);
    const checkedButtonCN = clsx(`${statusPickerButtonCN}_checked`);
    const statusTitleCN = clsx(`${baseCN}__title`);

    const statusClickHandler = (eventValue: TimeStatusType) => {
        onChangeCallback(value === eventValue ? null : eventValue);
    };

    return (
        <div className={baseCN}>
            {ITEMS.map((item) => {
                const checked = item.value === value;
                let title = item.title;

                if (item.addVariative) {
                    title +=
                        eventType === EventType.Project
                            ? ' проекта'
                            : ' задачи';
                }

                return (
                    <div key={item.value} className={statusItemCN}>
                        <button
                            disabled={disabled}
                            type='button'
                            className={clsx(
                                statusPickerButtonCN,
                                `${statusPickerButtonCN}_${item.value}`,
                                checked && checkedButtonCN
                            )}
                            onClick={() => {
                                statusClickHandler(item.value);
                            }}
                        >
                            {checked && <img src={Icons.checkmark} />}
                        </button>
                        <span className={statusTitleCN}>{title}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default TimeStatusEditor;
