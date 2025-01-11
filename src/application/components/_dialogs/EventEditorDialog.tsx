import EventTitleEditor from '../_editors/EventTitleEditor';
import { ColorStatusType } from '../_editors/TimeStatusEditor';
import { EventType } from '../_cards/_types/EventCardType';
import EditorUnit from '../_editors/EditorUnit';
import './EventEditorDialogStyle.css';
import clsx from 'clsx';
import { Icons } from '../../../Platform/_types/Icons';
import { useState } from 'react';
import { TimeEditorValueType } from '../../../Platform/_times/TimeEditor';

function EventEditorDialog() {
    const baseCN = 'eventEditorDialog';
    const wrapperCN = clsx(`${baseCN}__wrapper`);
    const crossCN = clsx(`${baseCN}__cross`);
    const buttonsCN = clsx(`${baseCN}__buttons`);

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

    return (
        <div className={wrapperCN}>
            <div className={baseCN}>
                <img className={crossCN} src={Icons.cross} />
                <EventTitleEditor
                    useTitle={useTitle}
                    eventType={EventType.Project}
                />
                <EditorUnit
                    usePlannedTime={testUseTime}
                    useFactTime={test2UseTime}
                    useTimeStatus={useChosedColorStatus}
                />
                <div className={buttonsCN}>ЗДЕСЬ БУДУТ КНОПОЧКИ!</div>
            </div>
        </div>
    );
}

export default EventEditorDialog;
