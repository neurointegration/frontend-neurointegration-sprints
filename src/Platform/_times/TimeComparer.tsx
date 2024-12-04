import clsx from 'clsx';
import './TimeComparerStyle.css';

/**
 * Символ прочерка для отображения при переданном value: null
 */
const EMPTY_TIME = '—';

type TimeComparerProps = {
    /**
     * Верхний/левый объект описания времени
     */
    firstTime: TimeDescriptor;

    /**
     * Нижний/правый объект описания времени
     */
    secontTime: TimeDescriptor;

    /**
     * Горизонтальная раскладка компонента
     */
    horizontal?: boolean;

    /**
     * Классы, навешиваемые на основной блок обертку компонента
     */
    className?: string;
};

/**
 * Формат описания объекта времени, включающий в себя значение и цвет подсветки
 */
type TimeDescriptor = {
    /**
     * Строк формата "12:34" или null, что соответствует символу прочерка
     * @remark Можно передать пустую строку и подсветить её при этом прчоерк выводиться не будет
     */
    value: string | null;

    /**
     * Цвет подсветки времени в зависимости от статуса
     * Для отсутствия подсветки можно переджать null или не задавать color вообще
     */
    color?: 'yellow' | 'green' | 'purple' | 'gray' | null;
};

/**
 * Компонент наглядного сравнения двух значений времени
 * @remark Принимает на вход объекты времени в специальном формате, включающем в себя
 * значение времени в виде строки и цвет подсветки
 */
function TimeComparer({
    firstTime,
    secontTime,
    horizontal = false,
    className,
}: TimeComparerProps) {
    const baseCN = 'controls-timeComparer';
    const wrapperCN = clsx(
        className,
        baseCN,
        horizontal && `${baseCN}_horizontal`
    );
    const firstTimeCN = clsx(
        `${baseCN}__time`,
        firstTime.color && `${baseCN}__time_${firstTime.color}`,
        horizontal ? `${baseCN}__time_horizontal` : `${baseCN}__time_vertical`
    );
    const secondTimeCN = clsx(
        `${baseCN}__time`,
        secontTime.color && `${baseCN}__time_${secontTime.color}`,
        horizontal ? `${baseCN}__time_horizontal` : `${baseCN}__time_vertical`
    );

    return (
        <div className={wrapperCN}>
            <span className={firstTimeCN}>{firstTime.value ?? EMPTY_TIME}</span>
            <span className={secondTimeCN}>
                {secontTime.value ?? EMPTY_TIME}
            </span>
        </div>
    );
}

export default TimeComparer;
