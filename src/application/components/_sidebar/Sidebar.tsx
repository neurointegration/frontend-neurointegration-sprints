import { NavLink, NavLinkProps, useLocation } from 'react-router-dom';
import { Icons } from '../../../Platform/_types/Icons';
import { Routes } from '../../../core/routing/routes';
import AuthAtom from '../../../core/atoms/auth.atom';
import { API } from '../../../core/api/handles';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { useEffect, useRef, useState } from 'react';
import './SidebarStyle.css';
import clsx from 'clsx';
import RolesAtom from '../../../core/atoms/roles.atom';
import MeInformationAtom from '../../../core/atoms/me.atom';

type SelectorItemType = {
    icon: Icons;
    routePath: Routes | '';
    title: string;
};

const SELECTOR_ITEMS_BASE: SelectorItemType[] = [
    { icon: Icons.pencil, routePath: Routes.Sprint, title: 'Спринт' },
    { icon: Icons.clock, routePath: Routes.Reflection, title: 'Рефлексия' },
    { icon: Icons.standup, routePath: Routes.Standup, title: 'Стендап' },
    { icon: Icons.calendar, routePath: Routes.History, title: 'История' },
    { icon: Icons.settings, routePath: Routes.Settings, title: 'Настройки' },
];

type SidebarProps = {
    menuButtonClassName?: string;
};

function Sidebar({ menuButtonClassName }: SidebarProps) {
    const resetAuthState = useResetRecoilState(AuthAtom);
    const rolesValue = useRecoilValue(RolesAtom);
    const meInformation = useRecoilValue(MeInformationAtom);
    const currentPath = useLocation();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [selectorItems, setSelectorItems] =
        useState<SelectorItemType[]>(SELECTOR_ITEMS_BASE);
    const emptyAvatarURL = '/logo.svg';

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

    useEffect(() => {
        if (rolesValue.isTrainer) {
            setSelectorItems(() => {
                const newItems = [...SELECTOR_ITEMS_BASE];
                newItems.splice(2, 0, {
                    icon: Icons.person,
                    routePath: Routes.Clients,
                    title: 'Клиенты',
                });

                return newItems;
            });
        }
    }, [rolesValue]);

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
            <div className={avatarCN} aria-hidden="true">
                <img
                    className={avatarImgCN}
                    src={meInformation.photoUrl ?? emptyAvatarURL}
                />
            </div>
            <div role='tablist' aria-orientation='vertical' className={menuSelectorCN}>
                {selectorItems.map((item) => (
                    <NavLink
                        role='tab'
                        aria-selected={ currentPath.pathname === item.routePath }
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
                    </NavLink >
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
