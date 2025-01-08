import { Icons } from '../../../Platform/_types/Icons';
import { useState } from 'react';
import './SidebarStyle.css';
import clsx from 'clsx';

// type SidebarProps = {

// };

const SELECTOR_ITEMS = [
    { icon: Icons.pencil, title: 'Спринт' },
    { icon: Icons.clock, title: 'Рефлексия (WIP)' },
    { icon: Icons.calendar, title: 'История' },
    // TODO: вкладка клиенты только для тренеров
    { icon: Icons.person, title: 'Клиенты' },
    { icon: Icons.settings, title: 'Настройки' },
];

function Sidebar() {
    const [expanded, setExpanded] = useState<boolean>(false);
    // TODO: добавить обработку аватарки
    const avatarURL = null;
    const emptyAvatarURL = '/empty-avatar.jpg';

    const baseCN = 'sidebar';
    const menuIconCN = clsx(`${baseCN}__menuIcon`);
    const menuCN = clsx('sidebarMenu');
    const menuOverlayCN = clsx(`${menuCN}__overlay`);
    const avatarCN = clsx(`${menuCN}__avatar`);
    const avatarImgCN = clsx(`${menuCN}__avatarImg`);
    const menuSelectorCN = clsx(`${menuCN}__selector`);
    const menuItemCN = clsx(`${menuCN}__item`);
    const menuItemIconCN = clsx(`${menuCN}__itemIcon`);
    const exitCN = clsx(`${menuCN}__exit`);

    // TODO: Добавить обработку роутинга на другие страницы
    const itemClickHandler = () => {
        setExpanded((prev) => !prev);
    };

    const menuIconClickHandler = () => {
        setExpanded((prev) => !prev);
    };

    const overlayClickHandler = () => {
        setExpanded((prev) => !prev);
    };

    const menuEl = (
        <div className={menuCN}>
            <div className={avatarCN}>
                <img
                    className={avatarImgCN}
                    src={avatarURL ?? emptyAvatarURL}
                />
            </div>
            <div className={menuSelectorCN}>
                {SELECTOR_ITEMS.map((item) => (
                    <button
                        onClick={itemClickHandler}
                        key={item.title}
                        className={menuItemCN}
                    >
                        <img className={menuItemIconCN} src={item.icon} />
                        <span>{item.title}</span>
                    </button>
                ))}
            </div>
            <button className={exitCN}>
                <img className={menuItemIconCN} src={Icons.exitArrow} />
                <span>Выход</span>
            </button>
        </div>
    );

    return (
        <div className={baseCN}>
            {!expanded && (
                <button onClick={menuIconClickHandler} className={menuIconCN}>
                    <img src={Icons.menu} />
                </button>
            )}
            {expanded && (
                <>
                    <div
                        className={menuOverlayCN}
                        onClick={overlayClickHandler}
                    />
                    {menuEl}
                </>
            )}
        </div>
    );
}

export default Sidebar;
