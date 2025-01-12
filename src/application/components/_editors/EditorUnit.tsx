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
    eventType: EventType;
};

function EditorUnit({
    usePlannedTime,
    useFactTime,
    useTimeStatus,
    eventType,
}: EditorUnitProps) {
    const baseCN = 'editorUnit';
    const timeBlockCN = clsx(`${baseCN}__timeBlock`);
    const plannedTimeBlockCN = clsx(timeBlockCN, `${baseCN}__plannedTimeBlock`);
    const factTimeBlockCN = clsx(timeBlockCN, `${baseCN}__factTimeBlock`);
    const timeBlockTitleCN = clsx(`${baseCN}__timeBlockTitle`);

    return (
        <div className={baseCN}>
            <div className={plannedTimeBlockCN}>
                <span className={timeBlockTitleCN}>Запланированное время</span>
                <TimeEditor useTimeValue={usePlannedTime} />
            </div>
            <div className={factTimeBlockCN}>
                <span className={timeBlockTitleCN}>Фактическое время</span>
                <TimeEditor useTimeValue={useFactTime} />
            </div>
            <TimeStatusEditor
                useTimeStatus={useTimeStatus}
                eventType={eventType}
            />
        </div>
    );
}

export default EditorUnit;
