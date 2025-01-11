import { useParams } from 'react-router';
import {
    EventType,
    TimeInfoType,
} from '../../components/_cards/_types/EventCardType';
import EventTitleEditor from '../../components/_editors/EventTitleEditor';
import { ColorStatusType } from '../../components/_editors/TimeStatusEditor';
import Sidebar from '../../components/_sidebar/Sidebar';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Button from '../../../Platform/_buttons/Button';
import './EventEditingStyle.css';
import Spoiler from '../../../Platform/_buttons/Spoiler';
import { TimeEditorValueType } from '../../../Platform/_times/TimeEditor';
import EditorUnit from '../../components/_editors/EditorUnit';

const SPOILER_UNITS = [
    {
        title: 'Общее',
        defaultOpen: true,
    },
    {
        title: 'Неделя 1',
        defaultOpen: false,
    },
    {
        title: 'Неделя 2',
        defaultOpen: false,
    },
    {
        title: 'Неделя 3',
        defaultOpen: false,
    },
    {
        title: 'Неделя 4',
        defaultOpen: false,
    },
];

function EventEditingScreen() {
    const params = useParams();
    const eventId = params.id;
    const eventType = params.type as EventType;

    // TODO: брать из натсроек пользователя настоящее количество недель
    const timeType = TimeInfoType.FourWeeks;

    useEffect(() => {
        if (timeType !== TimeInfoType.FourWeeks) {
            SPOILER_UNITS.pop();
        }
    }, []);

    const [timeStatus, setTimeStatus] = useState<ColorStatusType>(null);
    const [plannedTime, setPlannedTime] = useState<TimeEditorValueType>({
        hours: 98,
        minutes: 17,
    });
    const [factTime, setFactTime] = useState<TimeEditorValueType>({
        hours: 99,
        minutes: 1,
    });
    const [eventTitle, setEventTitle] = useState<string | null>(
        'Красивое название!'
    );

    const baseScreenCN = 'screen-EventEditing';
    const actionButtonsBlockCN = clsx(`${baseScreenCN}__actionButtonsBlock`);
    const pageHeaderCN = clsx(`${baseScreenCN}__header`);
    const pageContentCN = clsx(`${baseScreenCN}__pageContent`);
    const actionButtonCN = clsx(
        'controls-fontsize-m',
        'controls-fontweight-medium'
    );
    const spoilerButtonCN = clsx(
        'controls-margin_bottom-2xl',
        'controls-margin_top-3xl'
    );

    return (
        <>
            <div className={pageHeaderCN}>
                <div className={actionButtonsBlockCN}>
                    <Button
                        className={actionButtonCN}
                        caption='Отмена'
                        size='small'
                    />
                    <Button
                        disabled
                        className={actionButtonCN}
                        caption='Сохранить'
                        size='small'
                    />
                </div>
                <Sidebar />
            </div>
            <div className={pageContentCN}>
                <EventTitleEditor
                    eventType={eventType}
                    useTitle={[eventTitle, setEventTitle]}
                />
                {SPOILER_UNITS.map((spoilerItem) => (
                    // TODO: написать обработку всех времен проекта/задачи и передавать в спойлеры нужные компоненты времени
                    <Spoiler
                        title={spoilerItem.title}
                        buttonClassName={spoilerButtonCN}
                        defaultOpen={spoilerItem.defaultOpen}
                    >
                        <EditorUnit
                            usePlannedTime={[plannedTime, setPlannedTime]}
                            useFactTime={[factTime, setFactTime]}
                            useTimeStatus={[timeStatus, setTimeStatus]}
                            eventType={eventType}
                        />
                    </Spoiler>
                ))}
            </div>
        </>
    );
}

export default EventEditingScreen;
