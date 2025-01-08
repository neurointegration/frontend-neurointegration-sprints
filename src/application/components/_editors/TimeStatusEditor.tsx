import clsx from 'clsx';
import './TimeStatusEditorStyle.css';
import { EventType } from '../_cards/_types/EventCardType';
import { Icons } from '../../../Platform/_types/Icons';

type TimeStatusEditorProps = {
    useTimeStatus: [string, React.Dispatch<React.SetStateAction<string>>];
    type: EventType;
};

function TimeStatusEditor({
    useTimeStatus: [status, setStatus],
    type,
}: TimeStatusEditorProps) {
    const baseCN = 'timeStatusEditor';
    const statusPickerButtonCN = clsx(`${baseCN}__pickerButton`);
    const checkedButtonCN = clsx(`${statusPickerButtonCN}_checked`);
    const statusTitleCN = clsx(`${baseCN}__title`);

    const CHECKED = true;

    return (
        <div className={baseCN}>
            <div>
                <button
                    className={clsx(
                        statusPickerButtonCN,
                        CHECKED && checkedButtonCN
                    )}
                >
                    {CHECKED && <img src={Icons.checkmark} />}
                </button>
                <span className={statusTitleCN}>
                    Отказаться от{' '}
                    {type === EventType.Project ? 'проекта' : 'задачи'}
                </span>
            </div>
        </div>
    );
}

export default TimeStatusEditor;
