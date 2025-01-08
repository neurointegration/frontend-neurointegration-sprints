import clsx from 'clsx';
import './TimeEditorStyle.css';
import { SyntheticEvent } from 'react';

export type TimeEditorValueType = {
    hours: number;
    minutes: number;
};

export type UseTimeEditorValue = [
    TimeEditorValueType,
    React.Dispatch<React.SetStateAction<TimeEditorValueType>>
];

type TimeEditorProps = {
    useTimeValue: UseTimeEditorValue;
    className?: string;
};

const MAX_MINUTES = 59;
const MAX_HOURS = 100;
const PLUS_MINUTES_BUTTON = 30;
const PLUS_HOURS_BUTTON = 1;

const RESET_TIME_CROSS = '✖';

function TimeEditor({
    useTimeValue: [timeValue, setTimeValue],
    className,
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

    const inputClickSelectValueHandler = (event: SyntheticEvent) => {
        const target = event.target as unknown as { select: () => void };
        target.select();
    };
    // TODO: человекочитабельная ошибка о привышении мин макс значений

    /**
     * Обработчик клика по кнопке "+PLUS_MINUTES_BUTTON минут"
     */
    const minutesClickHandler = () => {
        setTimeValue((prev) => {
            const newVal = { ...prev };

            if (isNaN(prev.hours)) {
                newVal.hours = 0;
            }

            if (isNaN(prev.minutes)) {
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

            return newVal;
        });
    };

    /**
     * Обработчик клика по кнопке "+PLUS_HOURS_BUTTON часов"
     */
    const hoursClickHandler = () => {
        setTimeValue((prev) => {
            const newVal = { ...prev };

            if (isNaN(prev.hours)) {
                newVal.hours = 0;
            }

            if (isNaN(prev.minutes)) {
                newVal.minutes = 0;
            }

            if (newVal.hours < MAX_HOURS) {
                newVal.hours += 1;
            } else if (newVal.minutes < MAX_MINUTES) {
                newVal.minutes = MAX_MINUTES;
            }

            return newVal;
        });
    };

    /**
     * Обработчик клика по крестику сброса
     */
    const resetClickHandler = () => {
        setTimeValue(() => ({ hours: NaN, minutes: NaN }));
    };

    const hoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber;
        if (isNaN(value)) {
            setTimeValue((prev) => ({ ...prev, hours: NaN }));
            return;
        }

        if (_validateValue(value, 0, MAX_HOURS)) {
            setTimeValue((prev) => ({
                minutes: isNaN(prev.minutes) ? 0 : prev.minutes,
                hours: value,
            }));
        }
    };

    const minutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber;
        if (isNaN(value)) {
            setTimeValue((prev) => ({ ...prev, minutes: NaN }));
            return;
        }

        if (_validateValue(value, 0, MAX_MINUTES)) {
            setTimeValue((prev) => ({
                hours: isNaN(prev.hours) ? 0 : prev.hours,
                minutes: value,
            }));
        }
    };

    return (
        <div className={rootCN}>
            <div className={timeBlockCN}>
                <input
                    className={hoursInputCN}
                    type='number'
                    inputMode='numeric'
                    min={0}
                    max={MAX_HOURS}
                    value={isNaN(timeValue.hours) ? '' : timeValue.hours}
                    onChange={hoursChange}
                    onClick={inputClickSelectValueHandler}
                />
                <span className={inputSeparatorCN}>:</span>
                <input
                    className={minutesInputCN}
                    type='number'
                    inputMode='numeric'
                    min={0}
                    max={MAX_MINUTES}
                    value={isNaN(timeValue.minutes) ? '' : timeValue.minutes}
                    onChange={minutesChange}
                    onClick={inputClickSelectValueHandler}
                />
            </div>
            <div className={addButtonsBlockCN}>
                <button onClick={minutesClickHandler} className={addButtonCN}>
                    +{PLUS_MINUTES_BUTTON} минут
                </button>
                <button onClick={hoursClickHandler} className={addButtonCN}>
                    +{PLUS_HOURS_BUTTON} час
                </button>
                <button onClick={resetClickHandler} className={addButtonCN}>
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
