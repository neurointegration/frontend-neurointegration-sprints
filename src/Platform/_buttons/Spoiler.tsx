import { useState } from 'react';
import { Icons } from '../_types/Icons';
import clsx from 'clsx';
import './Spoiler.css';

type SpoilerProps = {
    // /**
    //  * Компонент, который будет скрываться под спойлер
    //  */
    // children: ReactNode;

    /**
     * Заголовок кнопки-спойлера
     */
    title: string;

    /**
     * Развернут ли спойлер по-умолчанию
     */
    defaultOpen?: boolean;

    /**
     * Класс, навешиваемый на компонент спойлера
     */
    buttonClassName?: string;
};

/**
 * HOC-комппонент спойлера. Рендерит переданный children под спойлером.
 * Принимает начальное состояние в пропсы
 */
function Spoiler({
    children,
    title,
    buttonClassName,
    defaultOpen = false,
}: React.PropsWithChildren<SpoilerProps>) {
    const [open, setOpen] = useState<boolean>(defaultOpen);
    const baseCN = 'controls-spoiler';
    // const wrapperCN = clsx(`${baseCN}__wrapper`, className && className);
    // const titleCN = clsx(`${baseCN}__title`);
    const buttonCN = clsx(
        `${baseCN}__button`,
        'controls-fontsize-xl',
        'controls-fontweight-medium',
        buttonClassName && buttonClassName
    );
    const iconCN = clsx(`${baseCN}__icon`, open && `${baseCN}__icon_opened`);

    const clickHandler = () => {
        setOpen((prev) => !prev);
    };

    return (
        <>
            <button className={buttonCN} onClick={clickHandler}>
                <span>{title}</span>
                <img src={Icons.dropdownArrow} className={iconCN} />
            </button>
            {open && children}
        </>
    );
}

export default Spoiler;
