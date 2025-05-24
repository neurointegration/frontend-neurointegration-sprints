import { Icons } from '../_types/Icons';
import './DropdownSelectorStyle.css';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { useRecoilState } from 'recoil';
import { ReflectionDropdownSelectedAtom } from '../../core/atoms/screensDropdown.atom';

type DropdownSelectorProps<T extends string | number> = {
    /**
     * Элементы для выбора в дропдауне
     * @remark В переданном массиве должен быть как минимум один элемент!
     */
    items: DropdownItem<T>[];

    /**
     * Хук хранения и изменения стейта "Выбранный элемент"
     * @example
     *
     */
    useSelectedItem: [
        DropdownItem<T> | null,
        React.Dispatch<React.SetStateAction<DropdownItem<T> | null>>
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
export type DropdownItem<T extends string | number> = {
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
    value: T;
};

/**
 * Компонент выбора из множественного значения с выпадающим списком
 */
function DropdownSelector<T extends string | number>({
    items,
    useSelectedItem: [selectedItem, setSelectedItem],
    className,
    selectedValueClassName,
}: DropdownSelectorProps<T>) {
    const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        ReflectionDropdownSelectedAtom
    );
    const dropdownClickHandler = () => {
        setIsSelectorOpen(() => !isSelectorOpen);
    };

    const overlayClickHandler = () => {
        setIsSelectorOpen(() => false);
    };

    const dropdownItemClickHandler = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setIsSelectorOpen(() => false);
        const newSelectedItem = items.find(
            (item) =>
                `${item.value}` === event.currentTarget.value ||
                (item.value === null && event.currentTarget.value === '')
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
        <div className={selectorCN} aria-live='polite'>
            {isSelectorOpen && (
                <div
                    className={selectorOverlayCN}
                    onClick={overlayClickHandler}
                />
            )}

            <button
                className={selectorButtonCN}
                onClick={dropdownClickHandler}
                value={selectedItem?.value}
                aria-expanded={isSelectorOpen}
                aria-label={selectedItem?.hint ? selectedItem?.caption + ': ' + selectedItem?.hint : selectedItem?.caption}
            >
                <div>
                    <div className={selectorHeaderCN}>
                        <span aria-hidden className={selectorHeaderCaptionCN}>
                            {selectedItem?.caption}
                        </span>
                        <img
                            aria-hidden
                            className={selectorArrowIconCN}
                            src={Icons.dropdownArrow}
                        />
                    </div>
                    <span aria-hidden className={selectorHintCN}>{selectedItem?.hint}</span>
                </div>
            </button>

            {isSelectorOpen && (
                <section className={selectorSelectCN} role='listbox' aria-label='Список возможных периодов'>
                    {items.map((item, index) => (
                        <button
                            className={selectorOptionCN}
                            value={item.value}
                            key={`dropdownTab${index}`}
                            onClick={dropdownItemClickHandler}
                            role='option'
                            aria-label={item.hint ? item.caption + ' ' + item.hint : 'Спринт: ' + item.caption}
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
                </section>
            )}
        </div>
    );
}

export default DropdownSelector;
