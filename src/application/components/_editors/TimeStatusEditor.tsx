import clsx from 'clsx';
import './TimeStatusEditorStyle.css';
import { EventType } from '../_cards/_types/EventCardType';
import { Icons } from '../../../Platform/_types/Icons';

export type ColorStatusType = 'yellow' | 'green' | 'purple' | null;
export type UseTimeStatusType = [
    ColorStatusType,
    React.Dispatch<React.SetStateAction<ColorStatusType>>
];

type TimeStatusEditorProps = {
    useTimeStatus: UseTimeStatusType;
    eventType: EventType;
};

const ITEMS: {
    title: string;
    value: ColorStatusType;
    addVariative: boolean;
}[] = [
    { title: 'Отказаться от', value: 'yellow', addVariative: true },
    { title: 'Продолжить так же', value: 'green', addVariative: false },
    { title: 'Скорректировать план', value: 'purple', addVariative: false },
];

function TimeStatusEditor({
    useTimeStatus: [status, setStatus],
    eventType,
}: TimeStatusEditorProps) {
    const baseCN = 'timeStatusEditor';
    const statusItemCN = clsx(`${baseCN}__statusItem`);
    const statusPickerButtonCN = clsx(`${baseCN}__pickerButton`);
    const checkedButtonCN = clsx(`${statusPickerButtonCN}_checked`);
    const statusTitleCN = clsx(`${baseCN}__title`);

    const statusClickHandler = (value: ColorStatusType) => {
        setStatus(() => (value === status ? null : value));
    };

    return (
        <div className={baseCN}>
            {ITEMS.map((item) => {
                const checked = item.value === status;
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
