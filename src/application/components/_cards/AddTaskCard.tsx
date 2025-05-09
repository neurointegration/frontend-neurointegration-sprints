import clsx from 'clsx';
import Button from '../../../Platform/_buttons/Button';
import { Icons } from '../../../Platform/_types/Icons';
import './AddTaskStyle.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { path, Routes } from '../../../core/routing/routes';
import { EventType } from './_types/EventCardType';
import { MainSectionType } from '../../../Platform/_types/Statuses';
import { BaseRegistryType } from '../../screens/home/constants';

type AddTaskCardProps = {
    /**
     * Указатель на проект, к которому относится кнопка добавления задачи
     */
    project: string | null;

    section: MainSectionType;

    registryType: BaseRegistryType;
};

/**
 * Контрол в виде карточки реестра с кнопкой "Добавить задачу" в проект
 * Должен отображаться при разворачивании любого проекта первой позицией
 */
function AddTaskCard({ project, section, registryType }: AddTaskCardProps) {
    const navigate = useNavigate();
    const pathParams = useParams();
    const clientId = pathParams.clientId;

    const baseCN = 'addTaskCard';
    const buttonCN = clsx(
        `${baseCN}__button`,
        'controls-fontsize-m',
        'controls-fontweight-medium'
    );

    const clickHandler = () => {
        navigate(path(Routes.Creation, { eventType: EventType.Task }), {
            state: { parentProjectId: project, section, registryType, clientId},
        });
    };

    return (
        <div className={baseCN}>
            <Button
                className={buttonCN}
                caption='Добавить задачу'
                icon={Icons.plus}
                onClick={clickHandler}
            />
        </div>
    );
}

export default AddTaskCard;
