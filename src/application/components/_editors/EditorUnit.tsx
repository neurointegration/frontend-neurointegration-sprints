import clsx from 'clsx';
import './EditorUnitStyle.css';
import TimeEditor, {
    UseTimeEditorValue,
} from '../../../Platform/_times/TimeEditor';
import TimeStatusEditor, { UseTimeStatusType } from './TimeStatusEditor';
import { EventType } from '../_cards/_types/EventCardType';

type EditorUnitProps = {
    usePlannedTime: UseTimeEditorValue;
    useFactTime: UseTimeEditorValue;
    useTimeStatus: UseTimeStatusType;
};

function EditorUnit({
    usePlannedTime,
    useFactTime,
    useTimeStatus,
}: EditorUnitProps) {
    const baseCN = 'editorUnit';
    const timeBlockCN = clsx(`${baseCN}__timeBlock`);
    const plannedTimeBlockCN = clsx(timeBlockCN, `${baseCN}__plannedTimeBlock`);
    const factTimeBlockCN = clsx(timeBlockCN, `${baseCN}__factTimeBlock`);
    const timeBlockTitleCN = clsx(`${baseCN}__timeBlockTitle`);

    return (
        <div className={baseCN}>
            <div className={plannedTimeBlockCN}>
                <span className={timeBlockTitleCN}>Запланированное вермя</span>
                <TimeEditor useTimeValue={usePlannedTime} />
            </div>
            <div className={factTimeBlockCN}>
                <span className={timeBlockTitleCN}>Фактическое вермя</span>
                <TimeEditor useTimeValue={useFactTime} />
            </div>
            {/* TODO: изменить константу type на динамику */}
            <TimeStatusEditor
                useTimeStatus={useTimeStatus}
                eventType={EventType.Task}
            />
        </div>
    );
}

export default EditorUnit;
