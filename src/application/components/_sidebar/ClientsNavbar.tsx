import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { path, Routes } from '../../../core/routing/routes';
import './ClientsNavbarStyle.css';
import clsx from 'clsx';

type SelectorItemType = {
    routePath: string;
    title: string;
};

function ClientsNavbar() {
    const currentPath = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const selectorItems: SelectorItemType[] = [
        { routePath: path(Routes.ClientSprint, { clientId: params.clientId }), title: 'Спринт' },
        { routePath: path(Routes.ClientReflection, { clientId: params.clientId }), title: 'Рефлексия' },
        { routePath: path(Routes.ClientStandup, { clientId: params.clientId }), title: 'Стендап' },
    ];

    const itemClickHandler = () => {
        navigate(path(Routes.ClientSprint, { clientId: params.clientId }));
    };

    return (
        <div className='client-info-screen_navbar'>
            {selectorItems.map((item) => (
                <NavLink
                    to={item.routePath}
                    onClick={itemClickHandler}
                    key={item.title}
                    className={ currentPath.pathname === item.routePath ?
                        'client-info-screen_item  item-state-active' :
                            'client-info-screen_item'}
                >
                <span>{item.title}</span>
                </NavLink>
            ))}
    </div>
    );
}

export default ClientsNavbar;
