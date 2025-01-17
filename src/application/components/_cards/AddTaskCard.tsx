import clsx from 'clsx';
import Button from '../../../Platform/_buttons/Button';
import { Icons } from '../../../Platform/_types/Icons';
import './AddTaskStyle.css';
import { useNavigate } from 'react-router-dom';
import { path, Routes } from '../../../core/routing/routes';
import { EventType } from './_types/EventCardType';
import { MainSectionType } from '../../../Platform/_types/Statuses';

type AddTaskCardProps = {
    /**
     * Указатель на проект, к которому относится кнопка добавления задачи
     */
    project: string | null;

    section: MainSectionType;
};

/**
 * Контрол в виде карточки реестра с кнопкой "Добавить задачу" в проект
 * Должен отображаться при разворачивании любого проекта первой позицией
 */
function AddTaskCard({ project, section }: AddTaskCardProps) {
    const navigate = useNavigate();

    const baseCN = 'addTaskCard';
    const buttonCN = clsx(
        `${baseCN}__button`,
        'controls-fontsize-m',
        'controls-fontweight-medium'
    );

    const clickHandler = () => {
        navigate(path(Routes.Creation, { eventType: EventType.Task }), {
            state: { parentProjectId: project, section },
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
