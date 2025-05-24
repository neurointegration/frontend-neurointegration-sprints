import clsx from 'clsx';
import './TimeEditorStyle.css';
import '../Styles/accessibility.css'
import { SyntheticEvent } from 'react';
import {
    PossibleTimeResponceKeysType,
    TaskOrProjectTimeDescriptorType,
    TimeType,
} from '../../core/api/actions/projects';

export type TimeEditorValueType = {
    hours: number;
    minutes: number;
};

export type UseTimeEditorValue = [
    TaskOrProjectTimeDescriptorType,
    React.Dispatch<React.SetStateAction<TaskOrProjectTimeDescriptorType>>
];

type TimeEditorProps = {
    value: null | TimeType;
    changeTimeCallback: (isPlanning: boolean, newValue: TimeType) => void;
    timeKey: PossibleTimeResponceKeysType;
    planningTime?: boolean;
    className?: string;
    disabled?: boolean;
    type?: string;
};

const MAX_MINUTES = 59;
const MAX_HOURS = 100;
const PLUS_MINUTES_BUTTON = 30;
const PLUS_HOURS_BUTTON = 1;

const RESET_TIME_CROSS = '✖';

function TimeEditor({
    value,
    changeTimeCallback,
    planningTime = false,
    className,
    disabled,
    type='',
}: TimeEditorProps) {
    const baseCN = 'controls-timeEditor';
    const rootCN = clsx(baseCN, className && className);
    const timeBlockCN = clsx(`${baseCN}__timeBlock`);
    const addButtonsBlockCN = clsx(`${baseCN}__addButtonsBlock`);
    const addButtonCN = clsx(`${baseCN}__addButton`);
    const inputCN = clsx(`${baseCN}__input`);
    const inputSeparatorCN = clsx(`${baseCN}__inputSeparator`);
    const hoursInputCN = clsx(inputCN, `${inputCN}_hours`);
    const minutesInputCN = clsx(inputCN, `${inputCN}_minutes`);
    const minutesHintCN = clsx(`${baseCN}__minutesHint`);
    const hoursHintCN = clsx(`${baseCN}__hoursHint`);

    const inputClickSelectValueHandler = (event: SyntheticEvent) => {
        const target = event.target as unknown as { select: () => void };
        target.select();
    };
    // TODO: человекочитабельная ошибка о привышении мин макс значений

    /**
     * Обработчик клика по кнопке "+PLUS_MINUTES_BUTTON минут"
     */
    const minutesClickHandler = () => {
        const newVal = { ...value };

        if (isNaN(value?.hours) || !value?.hours) {
            newVal.hours = 0;
        }

        if (isNaN(value?.minutes)) {
            newVal.minutes = 0;
        }

        const newM = newVal.minutes + PLUS_MINUTES_BUTTON;

        if (newM <= MAX_MINUTES) {
            newVal.minutes = newM;
        } else if (newVal.hours < MAX_HOURS) {
            newVal.hours += 1;
            newVal.minutes = newM % 60;
        } else {
            newVal.minutes = MAX_MINUTES;
        }

        changeTimeCallback(planningTime, newVal);
    };

    /**
     * Обработчик клика по кнопке "+PLUS_HOURS_BUTTON часов"
     */
    const hoursClickHandler = () => {
        const newVal = { ...value };

        if (isNaN(value?.hours)) {
            newVal.hours = 0;
        }

        if (isNaN(value?.minutes) || !value?.minutes) {
            newVal.minutes = 0;
        }

        if (newVal.hours < MAX_HOURS) {
            newVal.hours += 1;
        } else if (newVal.minutes < MAX_MINUTES) {
            newVal.minutes = MAX_MINUTES;
        }

        changeTimeCallback(planningTime, newVal);
    };

    /**
     * Обработчик клика по крестику сброса
     */
    const resetClickHandler = () => {
        changeTimeCallback(planningTime, {
            ...value,
            minutes: NaN,
            hours: NaN,
        });
    };

    const hoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const eventValue = event.target.valueAsNumber;
        if (isNaN(eventValue)) {
            changeTimeCallback(planningTime, { ...value, hours: NaN });
            return;
        }

        if (_validateValue(eventValue, 0, MAX_HOURS)) {
            changeTimeCallback(planningTime, {
                ...value,
                minutes: isNaN(value?.minutes) ? 0 : value?.minutes,
                hours: eventValue,
            });
        }
    };

    const minutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const eventValue = event.target.valueAsNumber;
        if (isNaN(eventValue)) {
            changeTimeCallback(planningTime, {
                ...value,
                minutes: NaN,
            });
            return;
        }

        if (_validateValue(eventValue, 0, MAX_MINUTES)) {
            changeTimeCallback(planningTime, {
                ...value,
                hours: isNaN(value?.hours) ? 0 : value?.hours,
                minutes: eventValue,
            });
        }
    };

    return (
        <div className={rootCN}>
            <div className={timeBlockCN}>
                {type == 'plan' ? <label className='sr-only' id='hours-label-plan'>Запланированное время часы</label> :
                <label className='sr-only' id='hours-label-fact'>Фактическое время часы</label>}
                <input
                    aria-labelledby={type == 'plan' ? 'hours-label-plan' : 'hours-label-fact'}
                    className={hoursInputCN}
                    type='number'
                    inputMode='numeric'
                    min={0}
                    max={MAX_HOURS}
                    value={isNaN(value?.hours) ? '' : value?.hours}
                    onChange={hoursChange}
                    onClick={inputClickSelectValueHandler}
                    disabled={disabled}
                />
                <span aria-hidden className={inputSeparatorCN}>:</span>
                {type == 'plan' ? <label className='sr-only' id='minutes-label-plan'>Запланированное время минуты</label> :
                <label className='sr-only' id='minutes-label-fact'>Фактическое время минуты</label>}
                <input
                    aria-labelledby={type == 'plan' ? 'minutes-label-plan' : 'minutes-label-fact'}
                    className={minutesInputCN}
                    type='number'
                    inputMode='numeric'
                    min={0}
                    max={MAX_MINUTES}
                    value={isNaN(value?.minutes) ? '' : value?.minutes}
                    onChange={minutesChange}
                    onClick={inputClickSelectValueHandler}
                    disabled={disabled}
                />
            </div>
            <div className={addButtonsBlockCN}>
                <button
                    disabled={disabled}
                    type='button'
                    onClick={minutesClickHandler}
                    className={addButtonCN}
                >
                    +{PLUS_MINUTES_BUTTON} <span className={minutesHintCN} />
                </button>
                <button
                    disabled={disabled}
                    type='button'
                    onClick={hoursClickHandler}
                    className={addButtonCN}
                >
                    +{PLUS_HOURS_BUTTON} <span className={hoursHintCN} />
                </button>
                <button
                    disabled={disabled}
                    type='button'
                    onClick={resetClickHandler}
                    className={addButtonCN}
                    aria-label={type == 'plan' ? 'Сбросить запланированное время' : 'Сбросить фактическое время'}
                >
                    {RESET_TIME_CROSS}
                </button>
            </div>
        </div>
    );
}

function _validateValue(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

export default TimeEditor;
