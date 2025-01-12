import clsx from 'clsx';
import Button from '../../../Platform/_buttons/Button';
import { Icons } from '../../../Platform/_types/Icons';
import './AddTaskStyle.css';

type AddTaskCardProps = {
    /**
     * Указатель на проект, к которому относится кнопка добавления задачи
     */
    project: string | null;
};

/**
 * Контрол в виде карточки реестра с кнопкой "Добавить задачу" в проект
 * Должен отображаться при разворачивании любого проекта первой позицией
 */
function AddTaskCard({ project }: AddTaskCardProps) {
    const baseCN = 'addTaskCard';
    const buttonCN = clsx(`${baseCN}__button`, 'controls-fontsize-m', 'controls-fontweight-medium');

    const clickHandler = () => {};

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
