import { EventCardType, EventType } from '../_cards/_types/EventCardType';
import EventTitleEditor from '../_editors/EventTitleEditor';
import { Icons } from '../../../Platform/_types/Icons';
import EditorUnit from '../_editors/EditorUnit';
import { SyntheticEvent, useState } from 'react';
import './EventEditorDialogStyle.css';
import clsx from 'clsx';
import { RegistryItemType } from '../_registry/EventRegistry';
import {
    EditingFormContextPropertyChangedFuncType,
    EditingScreenFormContext,
} from '../../screens/editing/EventEditingContext';
import EditorFormController from '../_controllers/EditorFormController';
import { PossibleTimeResponceKeysType } from '../../../core/api/actions/projects';

type EventDitorDialogProps = {
    /**
     * Обработчик клика по кнопке закрытия модального окна
     */
    onClose: (event: SyntheticEvent) => void;

    /**
     * Айтем с данными события
     */
    itemDescriptor?: RegistryItemType;

    /**
     * Ключ к нужному эдитору времени
     */
    timeKey: PossibleTimeResponceKeysType;
};

function EventEditorDialog({
    onClose,
    itemDescriptor,
    timeKey,
}: EventDitorDialogProps) {
    const item = itemDescriptor.item as EventCardType;
    const baseCN = 'eventEditorDialog';
    const wrapperCN = clsx(`${baseCN}__wrapper`);
    const crossCN = clsx(`${baseCN}__cross`);
    const buttonsCN = clsx(`${baseCN}__buttons`);
    const dialogOverlayCN = clsx(`${baseCN}__overlay`);
    const actionButtonCN = clsx(`${baseCN}__actionButton`);
    const saveButtonCN = clsx(actionButtonCN, `${actionButtonCN}_outlined`);

    const CONTROLLER = EditorFormController(
        itemDescriptor,
        false,
        itemDescriptor.project ? EventType.Task : EventType.Project,
        itemDescriptor.sectionName,
        itemDescriptor.project
    );

    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const closeClickHandler = (event: SyntheticEvent) => {
        onClose(event);
    };

    const submitHandler = (event: SyntheticEvent) => {
        event.preventDefault();
        CONTROLLER.saveHandler(0);
    }

    const propertyChanged: EditingFormContextPropertyChangedFuncType = (
        propertyKey,
        newValue
    ): void => {
        CONTROLLER.useChanges[1]((prev) => {
            const newChanges = { ...prev, [propertyKey]: newValue };
            // console.log(newChanges);

            setSaveButtonDisabled(() => !Object.keys(newChanges).length);
            return newChanges;
        });
    };

    return (
        <EditingScreenFormContext.Provider value={{ propertyChanged }}>
            <form onSubmit={submitHandler}>
                <div className={wrapperCN}>
                    <div className={dialogOverlayCN} />
                    <div className={baseCN}>
                        <button type='button' onClick={closeClickHandler}>
                            <img className={crossCN} src={Icons.cross} />
                        </button>
                        <EventTitleEditor
                            useTitle={CONTROLLER.useEventTitle}
                            eventType={item.type}
                        />
                        <EditorUnit
                            timeKey={timeKey}
                            usePlanningTimes={CONTROLLER.usePlanningTimes}
                            useFactTimes={CONTROLLER.useFactTimes}
                            eventType={item.type}
                        />
                        <div className={buttonsCN}>
                            <button
                                type='submit'
                                className={saveButtonCN}
                                disabled={saveButtonDisabled}
                            >
                                Сохранить
                            </button>
                            <button
                                type='button'
                                className={actionButtonCN}
                                onClick={closeClickHandler}
                            >
                                Отменить
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </EditingScreenFormContext.Provider>
    );
}

export default EventEditorDialog;
