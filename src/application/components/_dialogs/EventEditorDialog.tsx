import { TimeEditorValueType } from '../../../Platform/_times/TimeEditor';
import { ColorStatusType } from '../_editors/TimeStatusEditor';
import { EventCardType } from '../_cards/_types/EventCardType';
import EventTitleEditor from '../_editors/EventTitleEditor';
import { Icons } from '../../../Platform/_types/Icons';
import EditorUnit from '../_editors/EditorUnit';
import { SyntheticEvent, useState } from 'react';
import './EventEditorDialogStyle.css';
import clsx from 'clsx';

type EventDitorDialogProps = {
    /**
     * Обработчик клика по кнопке закрытия модального окна
     */
    onClose: (event: SyntheticEvent) => void;

    /**
     * Идентификатор события (задача или проект), по которому будет вычитана информация
     * для редактирования
     * @remark
     * Если передан null -
     */
    eventId: string;

    /**
     * Айтем с данными события
     */
    item?: EventCardType;
};

function EventEditorDialog({ onClose, eventId, item }: EventDitorDialogProps) {
    const baseCN = 'eventEditorDialog';
    const wrapperCN = clsx(`${baseCN}__wrapper`);
    const crossCN = clsx(`${baseCN}__cross`);
    const buttonsCN = clsx(`${baseCN}__buttons`);
    const dialogOverlayCN = clsx(`${baseCN}__overlay`);
    const actionButtonCN = clsx(`${baseCN}__actionButton`);
    const saveButtonCN = clsx(actionButtonCN, `${actionButtonCN}_outlined`);

    const testUseTime = useState<TimeEditorValueType>({
        hours: 98,
        minutes: 17,
    });
    const test2UseTime = useState<TimeEditorValueType>({
        hours: 99,
        minutes: 1,
    });

    const useChosedColorStatus = useState<ColorStatusType>(null);

    const useTitle = useState<string | null>(item.title || null);

    const closeClickHandler = (event: SyntheticEvent) => {
        onClose(event);
    };

    return (
        <div className={wrapperCN}>
            <div className={dialogOverlayCN} />
            <div className={baseCN}>
                <button onClick={closeClickHandler}>
                    <img className={crossCN} src={Icons.cross} />
                </button>
                <EventTitleEditor
                    useTitle={useTitle}
                    eventType={item.type}
                    disabled
                />
                {/* TODO: заменить на динамику eventType */}
                <EditorUnit
                    usePlannedTime={testUseTime}
                    useFactTime={test2UseTime}
                    useTimeStatus={useChosedColorStatus}
                    eventType={item.type}
                />
                <div className={buttonsCN}>
                    <button className={saveButtonCN}>Сохранить</button>
                    <button
                        className={actionButtonCN}
                        onClick={closeClickHandler}
                    >
                        Отменить
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventEditorDialog;
