import clsx from 'clsx';
import './TimeComparerStyle.css';
import { TimeType } from '../../core/api/actions/projects';

/**
 * Символ для отображения при переданном value: null или undefined
 */
const EMPTY_TIME = '';

export type TimeStatusType = 'Decline' | 'Continue' | 'Modify';

// /**
//  * Формат описания объекта времени, включающий в себя значение и цвет подсветки
//  */
// export type TimeDescriptor = {
//     /**
//      * Плановое время по проекту/задаче
//      */
//     planning?: { [key in keyof PossibleTimeResponceKeysType]: TimeType };

//     /**
//      * Фактическое время по проекту/задаче. Может окрашиваться в зависимости от статуса
//      */
//     fact?: {
//         [key in keyof PossibleTimeResponceKeysType]: FactTimeType;
//     };
// };

type TimeComparerProps = {
    /**
     * Информация о времени, планируемом и фактическом
     */
    times: {
        planning: TimeType | null;
        fact: TimeType | null;
    };

    /**
     * Горизонтальная раскладка компонента
     */
    horizontal?: boolean;

    /**
     * Классы, навешиваемые на основной блок обертку компонента
     */
    className?: string;

    week: string;
};

function TimeComparer({
    week,
    times: { planning, fact },
    horizontal = false,
    className,
}: TimeComparerProps) {
    const baseCN = 'controls-timeComparer';
    const wrapperCN = clsx(
        className,
        baseCN,
        horizontal && `${baseCN}_horizontal`
    );
    const planningTimeCN = clsx(
        `${baseCN}__time`,
        horizontal ? `${baseCN}__time_horizontal` : `${baseCN}__time_vertical`
    );
    const factTimeCN = clsx(
        `${baseCN}__time`,
        fact && `${baseCN}__time_${fact.status ?? 'Empty'}`,
        !fact && `${baseCN}__time_Empty`,
        horizontal ? `${baseCN}__time_horizontal` : `${baseCN}__time_vertical`
    );

    const planningValue = planning
        ? `${_formatValue(planning.hours)}:${_formatValue(planning.minutes)}`
        : EMPTY_TIME;
    const factValue = fact ? (fact.hours || fact.minutes)
        ? `${_formatValue(fact.hours)}:${_formatValue(fact.minutes)}`
        : EMPTY_TIME : EMPTY_TIME;

    return (
        <div className={wrapperCN}>
            <span className={planningTimeCN} aria-role='time' aria-description={week + '. ' + (planningValue ? 'Запланированное время' : 'Запланированное время не задано')}>{planningValue}</span>
            <span className={factTimeCN} aria-role='time' aria-description={week + '. ' + (factValue ? 'Фактическое время' : 'Фактическое время не задано')}>{factValue}</span>
        </div>
    );
}

const _formatValue = (value: number): string => {
    const isThreeDigit = value / 100 >= 1;
    return isThreeDigit ? `${value}` : `0${value}`.slice(-2);
};

export default TimeComparer;
