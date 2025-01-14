import { NavLink, useLocation } from 'react-router-dom';
import { Icons } from '../../../Platform/_types/Icons';
import { Routes } from '../../../core/routing/routes';
import authAtom from '../../../core/atoms/auth.atom';
import { API } from '../../../core/api/handles';
import { useResetRecoilState } from 'recoil';
import { useState } from 'react';
import './SidebarStyle.css';
import clsx from 'clsx';

const SELECTOR_ITEMS = [
    { icon: Icons.pencil, routePath: Routes.Sprint, title: 'Спринт' },
    { icon: Icons.clock, routePath: '', title: 'Рефлексия (WIP)' },
    { icon: Icons.calendar, routePath: '', title: 'История' },
    // TODO: вкладка клиенты только для тренеров
    { icon: Icons.person, routePath: '', title: 'Клиенты' },
    { icon: Icons.settings, routePath: Routes.Settings, title: 'Настройки' },
];

type SidebarProps = {
    menuButtonClassName?: string;
};

function Sidebar({ menuButtonClassName }: SidebarProps) {
    const resetAuthState = useResetRecoilState(authAtom);
    const currentPath = useLocation();
    const [expanded, setExpanded] = useState<boolean>(false);
    // TODO: добавить обработку аватарки
    const avatarURL = null;
    const emptyAvatarURL = '/empty-avatar.gif';

    const baseCN = 'sidebar';
    const menuIconCN = clsx(
        `${baseCN}__menuIcon`,
        menuButtonClassName && menuButtonClassName
    );
    const menuCN = clsx('sidebarMenu');
    const menuOverlayCN = clsx(`${menuCN}__overlay`);
    const avatarCN = clsx(`${menuCN}__avatar`);
    const avatarImgCN = clsx(`${menuCN}__avatarImg`);
    const menuSelectorCN = clsx(`${menuCN}__selector`);
    const menuItemCN = clsx(`${menuCN}__item`);
    const menuItemIconCN = clsx(`${menuCN}__itemIcon`);
    const exitCN = clsx(`${menuCN}__exit`);

    const itemClickHandler = () => {
        setExpanded((prev) => !prev);
    };

    const menuIconClickHandler = () => {
        setExpanded((prev) => !prev);
    };

    const overlayClickHandler = () => {
        setExpanded((prev) => !prev);
    };

    const exitClickHandler = () => {
        API.AUTH.Logout().then((resp) => {
            if (resp.isSuccess) {
                resetAuthState();
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                location.reload();
            }
        });
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
                    <NavLink
                        to={item.routePath}
                        onClick={itemClickHandler}
                        key={item.title}
                        className={clsx(
                            menuItemCN,
                            currentPath.pathname === item.routePath &&
                                `${menuItemCN}_active`
                        )}
                    >
                        <img className={menuItemIconCN} src={item.icon} />
                        <span>{item.title}</span>
                    </NavLink>
                ))}
            </div>
            <button className={exitCN} onClick={exitClickHandler}>
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
