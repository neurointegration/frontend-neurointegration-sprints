import clsx from 'clsx';
import './EditorUnitStyle.css';
import TimeEditor, {
    UseTimeEditorValue,
} from '../../../Platform/_times/TimeEditor';
import TimeStatusEditor from './TimeStatusEditor';
import { EventType } from '../_cards/_types/EventCardType';
import {
    PossibleTimeResponceKeysType,
    TimeType,
} from '../../../core/api/actions/projects';
import { useContext } from 'react';
import { EditingScreenFormContext } from '../../screens/editing/EventEditingContext';
import { TimeStatusType } from '../../../Platform/_times/TimeComparer';

type EditorUnitProps = {
    timeKey: PossibleTimeResponceKeysType;
    usePlanningTimes: UseTimeEditorValue;
    useFactTimes: UseTimeEditorValue;
    eventType: EventType;
};

function EditorUnit({
    timeKey,
    usePlanningTimes: [planning, setPlanning],
    useFactTimes: [fact, setFact],
    eventType,
}: EditorUnitProps) {
    const baseCN = 'editorUnit';
    const timeBlockCN = clsx(`${baseCN}__timeBlock`);
    const plannedTimeBlockCN = clsx(timeBlockCN, `${baseCN}__plannedTimeBlock`);
    const factTimeBlockCN = clsx(timeBlockCN, `${baseCN}__factTimeBlock`);
    const timeBlockTitleCN = clsx(`${baseCN}__timeBlockTitle`);

    const editingFormContext = useContext(EditingScreenFormContext);

    const changeTimeValues = (
        isPlanning: boolean = false,
        newValue: TimeType
    ) => {
        (isPlanning ? setPlanning : setFact)((prev) => {
            const newState = {
                ...prev,
                [timeKey]:
                    isNaN(newValue.hours) || isNaN(newValue.minutes)
                        ? null
                        : newValue,
            };

            editingFormContext.propertyChanged(
                isPlanning ? 'planningTimes' : 'factTimes',
                newState
            );

            return newState;
        });
    };

    const changeStatus = (newStatus: TimeStatusType) => {
        setFact((prev) => {
            const timeValue = prev?.[timeKey];
            const newState = {
                ...prev,
                [timeKey]: { ...prev?.[timeKey], status: newStatus },
            };

            if (
                newStatus &&
                (isNaN(timeValue?.hours) || isNaN(timeValue?.minutes))
            ) {
                newState[timeKey] = { hours: 0, minutes: 0, status: newStatus };
            }

            editingFormContext.propertyChanged('factTimes', newState);

            return newState;
        });
    };

    return (
        <div className={baseCN}>
            <div className={plannedTimeBlockCN}>
                <span className={timeBlockTitleCN}>Запланированное время</span>
                <TimeEditor
                    timeKey={timeKey}
                    value={planning?.[timeKey]}
                    changeTimeCallback={changeTimeValues}
                    planningTime
                />
            </div>
            <div className={factTimeBlockCN}>
                <span className={timeBlockTitleCN}>Фактическое время</span>
                <TimeEditor
                    timeKey={timeKey}
                    value={fact?.[timeKey]}
                    changeTimeCallback={changeTimeValues}
                />
            </div>
            <TimeStatusEditor
                value={fact?.[timeKey]?.status}
                onChangeCallback={changeStatus}
                eventType={eventType}
            />
        </div>
    );
}

export default EditorUnit;
