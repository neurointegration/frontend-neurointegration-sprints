import clsx from 'clsx';
import './EditorUnitStyle.css';
import TimeEditor, { UseTimeEditorValue } from '../../../Platform/_times/TimeEditor';

type EditorUnitProps = {
    usePlannedTime: UseTimeEditorValue;
    useFactTime: UseTimeEditorValue;
}

function EditorUnit({usePlannedTime, useFactTime}: EditorUnitProps) {
    const baseCN = 'editorUnit';
    const timeBlockCN = clsx(`${baseCN}__timeBlock`);
    const plannedTimeBlockCN = clsx(timeBlockCN, `${baseCN}__plannedTimeBlock`);
    const factTimeBlockCN = clsx(timeBlockCN, `${baseCN}__factTimeBlock`);
    const statusChoserCN = clsx(`${baseCN}__statusChooser`);
    const timeBlockTitleCN = clsx(`${baseCN}__timeBlockTitle`)

    return (
        <div className={baseCN}>
            <div className={plannedTimeBlockCN}>
                <span className={timeBlockTitleCN}>Запланированное вермя</span>
                <TimeEditor useTimeValue={usePlannedTime}/>
            </div>
            <div className={factTimeBlockCN}>
                <span className={timeBlockTitleCN}>Фактическое вермя</span>
                <TimeEditor useTimeValue={useFactTime}/>
                <div className={statusChoserCN}></div>
            </div>
        </div>
    );
}

export default EditorUnit;
