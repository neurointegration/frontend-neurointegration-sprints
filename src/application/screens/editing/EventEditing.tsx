import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    EventCardType,
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
import { RegistryItemType } from '../../components/_registry/EventRegistry';
import { useRecoilValue } from 'recoil';
import MeInformationAtom from '../../../core/atoms/me.atom';

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
    const location = useLocation();
    const params = useParams();

    const navigate = useNavigate();

    const itemDescriptor = location.state.eventDescriptor as RegistryItemType;
    const eventId = itemDescriptor.id;
    const eventType = params.eventType as EventType;

    const [spoilerUnits, setSpoilerUnits] =
        useState<{ title: string; defaultOpen: boolean }[]>(SPOILER_UNITS);

    // TODO: брать из натсроек пользователя настоящее количество недель

    const timeType = useRecoilValue(MeInformationAtom); //TimeInfoType.FourWeeks;

    useEffect(() => {
        document.body.className = `body-color-white`;
        if (timeType.sprintWeeksCount !== 4) {
            setSpoilerUnits(() => {
                const res = [...SPOILER_UNITS];
                delete res[4];
                return res;
            });
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
        (itemDescriptor.item as EventCardType).title
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

    const factTimes = (itemDescriptor.item as EventCardType).timeValues.factTimes;
    const planningTimes = (itemDescriptor.item as EventCardType).timeValues.planningTimes;

    return (
        <>
            <div className={pageHeaderCN}>
                <div className={actionButtonsBlockCN}>
                    <Button
                        onClick={() => navigate(-1)}
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
                {spoilerUnits.map((spoilerItem, index) => (
                    // TODO: написать обработку всех времен проекта/задачи и передавать в спойлеры нужные компоненты времени
                    <Spoiler
                        key={`spoilerItem_${index}`}
                        title={spoilerItem.title}
                        buttonClassName={spoilerButtonCN}
                        defaultOpen={spoilerItem.defaultOpen}
                    >
                        <EditorUnit
                            // defaultFactTime={}
                            // defaultPlanningTime={}
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
