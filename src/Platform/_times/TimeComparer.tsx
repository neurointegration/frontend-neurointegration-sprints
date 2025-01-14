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
};

function TimeComparer({
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

    const planningValue = `${_doblelize(planning?.hours)}:${_doblelize(
        planning?.minutes
    )}`;
    const factValue = `${_doblelize(fact?.hours)}:${_doblelize(fact?.minutes)}`;

    return (
        <div className={wrapperCN}>
            <span className={planningTimeCN}>
                {planning ? planningValue : EMPTY_TIME}
            </span>
            <span className={factTimeCN}>{fact ? factValue : EMPTY_TIME}</span>
        </div>
    );
}

const _doblelize = (value: number): string => {
    return `0${value}`.slice(-2);
};

export default TimeComparer;
