import EventTitleEditor from '../_editors/EventTitleEditor';
import { ColorStatusType } from '../_editors/TimeStatusEditor';
import { EventType } from '../_cards/_types/EventCardType';
import EditorUnit from '../_editors/EditorUnit';
import './EventEditorDialogStyle.css';
import clsx from 'clsx';
import { Icons } from '../../../Platform/_types/Icons';
import { SyntheticEvent, useState } from 'react';
import { TimeEditorValueType } from '../../../Platform/_times/TimeEditor';

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
};

function EventEditorDialog({ onClose }: EventDitorDialogProps) {
    const baseCN = 'eventEditorDialog';
    const wrapperCN = clsx(`${baseCN}__wrapper`);
    const crossCN = clsx(`${baseCN}__cross`);
    const buttonsCN = clsx(`${baseCN}__buttons`);
    const dialogOverlayCN = clsx(`${baseCN}__overlay`);

    const testUseTime = useState<TimeEditorValueType>({
        hours: 98,
        minutes: 17,
    });
    const test2UseTime = useState<TimeEditorValueType>({
        hours: 99,
        minutes: 1,
    });

    const useChosedColorStatus = useState<ColorStatusType>(null);

    const useTitle = useState<string | null>(
        'Очень при очень длинное название при название при очень при очень'
    );

    const crossClickHandler = (event: SyntheticEvent) => {
        onClose(event);
    };

    return (
        <div className={wrapperCN}>
            <div className={dialogOverlayCN} />
            <div className={baseCN}>
                <button onClick={crossClickHandler}>
                    <img className={crossCN} src={Icons.cross} />
                </button>
                <EventTitleEditor
                    useTitle={useTitle}
                    eventType={EventType.Project}
                    disabled
                />
                {/* TODO: заменить на динамику eventType */}
                <EditorUnit
                    usePlannedTime={testUseTime}
                    useFactTime={test2UseTime}
                    useTimeStatus={useChosedColorStatus}
                    eventType={EventType.Project}
                />
                <div className={buttonsCN}>ЗДЕСЬ БУДУТ КНОПОЧКИ!</div>
            </div>
        </div>
    );
}

export default EventEditorDialog;
