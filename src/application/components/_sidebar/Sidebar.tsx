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
import { localStorageClean } from '../../../core/api/utils/localStorageCleaner';

type SelectorItemType = {
    icon: Icons;
    routePath: Routes | '';
    title: string;
};

const SELECTOR_ITEMS_BASE: SelectorItemType[] = [
    { icon: Icons.pencil, routePath: Routes.Sprint, title: 'Спринт' },
    { icon: Icons.standup, routePath: Routes.Standup, title: 'Стендап' },
    { icon: Icons.clock, routePath: Routes.Reflection, title: 'Рефлексия' },
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
                newItems.push({
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
                localStorageClean();

                const searchParams = new URLSearchParams(window.location.search);
                
                searchParams.delete('id');
                searchParams.delete('first_name');
                searchParams.delete('last_name');
                searchParams.delete('username');
                searchParams.delete('photo_url');
                searchParams.delete('auth_date');
                searchParams.delete('hash');

                location.reload();
            }
        });
    };

function handleEsc(event) {
    if (event.keyCode === 27) {
        setExpanded((prev) => prev ? !prev : prev);
    }
  }

    useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

    const menuEl = (
        <div className={menuCN}>
            <div className={avatarCN} aria-hidden>
                <img
                    aria-hidden
                    className={avatarImgCN}
                    src={meInformation.photoUrl ?? emptyAvatarURL}
                />
            </div>
            <nav aria-orientation='vertical' className={menuSelectorCN} >
                <ul className='without-style'>
                {selectorItems.map((item) => (
                    <li className='without-style'>
                    <NavLink
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
                        <img className={menuItemIconCN} aria-hidden src={item.icon} />
                        <span>{item.title}</span>
                    </NavLink >
                    </li>
                ))}
                </ul>
            </nav>
            <button className={exitCN} onClick={exitClickHandler}>
                <img aria-hidden className={menuItemIconCN} src={Icons.exitArrow} />
                <span>Выход</span>
            </button>
        </div>
    );

    return (
        <div className={baseCN} aria-live='polite'>
            <button onClick={menuIconClickHandler} className={menuIconCN} aria-label='Меню' aria-expanded={expanded}>
                <img aria-hidden src={Icons.menu} />
            </button>
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
