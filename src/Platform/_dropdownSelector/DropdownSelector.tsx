import { Icons } from '../_types/Icons';
import './DropdownSelectorStyle.css';
import { useState } from 'react';
import clsx from 'clsx';

type DropdownSelectorProps = {
    /**
     * Элементы для выбора в дропдауне
     * @remark В переданном массиве должен быть как минимум один элемент!
     */
    items: DropdownItem[];

    /**
     * Хук хранения и изменения стейта "Выбранный элемент"
     * @example
     *
     */
    useSelectedItem: [
        DropdownItem,
        React.Dispatch<React.SetStateAction<DropdownItem>>
    ];

    /**
     * Классы, навешиваемые на элемент селектора
     */
    className?: string;

    /**
     * Классы, навешиваемые на выбранный в селекторе элемент
     */
    selectedValueClassName?: string;
};

/**
 * Тип описывающий элемент выпадающего списка
 */
export type DropdownItem = {
    /**
     * Отображаемый заголовок
     */
    caption: string;

    /**
     * Подробная подсказка или уточнение заголовка
     * @remark Отображается слева в меню выбора или снизу в выбранной позиции
     */
    hint?: string;

    /**
     * Уникальное значение для идентификации и определения выбранного элемента
     */
    value: string | number;
};

/**
 * Компонент выбора из множественного значения с выпадающим списком
 */
function DropdownSelector({
    items,
    useSelectedItem: [selectedItem, setSelectedItem],
    className,
    selectedValueClassName,
}: DropdownSelectorProps) {
    const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);

    const dropdownClickHandler = () => {
        setIsSelectorOpen(() => true);
    };

    const overlayClickHandler = () => {
        setIsSelectorOpen(() => false);
    };

    const dropdownItemClickHandler = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setIsSelectorOpen(() => false);
        const newSelectedItem = items.find(
            (item) => item.value === event.currentTarget.value
        );
        setSelectedItem(() => newSelectedItem);
    };

    const baseCN = `controls-dropdownSelector`;
    const selectorCN = clsx(
        className,
        `${baseCN}`,
        `controls-span-overflow-ellipsis`
    );
    const selectorOverlayCN = clsx(`${baseCN}__overlay`);
    const selectorButtonCN = clsx(
        selectedValueClassName,
        `${baseCN}__button`,
        `${baseCN}__button_selected`
    );
    const selectorHeaderCN = clsx(`${baseCN}__header`);
    const selectorHeaderCaptionCN = clsx(`${baseCN}__caption`);
    const selectorHintCN = clsx(`${baseCN}__hint`);
    const selectorOptionCN = clsx(`${baseCN}__button`, `${baseCN}__option`);
    const selectorSelectCN = clsx(`${baseCN}__select`);
    const selectorSelectCaptionCN = clsx(`${baseCN}__caption_option`);
    const selectorArrowIconCN = clsx(
        `${baseCN}__icon`,
        isSelectorOpen && `${baseCN}__select_rotated`
    );

    return (
        <div className={selectorCN}>
            {isSelectorOpen && (
                <div
                    className={selectorOverlayCN}
                    onClick={overlayClickHandler}
                />
            )}

            <button
                className={selectorButtonCN}
                onClick={dropdownClickHandler}
                value={selectedItem.value}
            >
                <div>
                    <div className={selectorHeaderCN}>
                        <span className={selectorHeaderCaptionCN}>
                            {selectedItem.caption}
                        </span>
                        <img
                            className={selectorArrowIconCN}
                            src={Icons.dropdownArrow}
                        />
                    </div>
                    <span className={selectorHintCN}>{selectedItem.hint}</span>
                </div>
            </button>

            {isSelectorOpen && (
                <div className={selectorSelectCN}>
                    {items.map((item) => (
                        <button
                            className={selectorOptionCN}
                            value={item.value}
                            key={item.value}
                            onClick={dropdownItemClickHandler}
                        >
                            <span
                                className={clsx(
                                    item.hint && selectorSelectCaptionCN
                                )}
                            >
                                {item.caption}
                            </span>
                            {item.hint && (
                                <span className={selectorHintCN}>
                                    {item.hint}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropdownSelector;
